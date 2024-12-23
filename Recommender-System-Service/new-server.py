import pandas as pd
from surprise import SVD, Dataset, Reader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import tensorflow as tf
from tensorflow.keras.layers import Input, Embedding, Flatten, Dot, Dense, Concatenate
from tensorflow.keras.models import Model

# Load data
data = pd.read_csv('aggregated_for_recommender.csv')

# TF-IDF (Content-Based Filtering)
def build_tfidf_model(data):
    content_df = data[['Product ID', 'Product Name', 'Brand', 'Price']]
    content_df['content'] = content_df.apply(lambda row: ' '.join(row.dropna().astype(str)), axis=1)
    tfidf_vectorizer = TfidfVectorizer()
    content_matrix = tfidf_vectorizer.fit_transform(content_df['content'])
    content_similarity = linear_kernel(content_matrix, content_matrix)
    return content_similarity, content_df

def get_content_recommendations(product_id, top_n, content_similarity, content_df):
    index = content_df[content_df['Product ID'] == product_id].index[0]
    similarity_scores = content_similarity[index]
    similar_indices = similarity_scores.argsort()[::-1][1:top_n+1]
    recommendations = content_df.loc[similar_indices, 'Product ID'].values
    return recommendations.tolist()

# SVD (Collaborative Filtering)
def build_svd_model(data):
    reader = Reader(rating_scale=(1, 5))
    data_surprise = Dataset.load_from_df(data[['user_id', 'Product ID', 'Rating']], reader)
    trainset = data_surprise.build_full_trainset()
    svd_model = SVD()
    svd_model.fit(trainset)
    return svd_model, trainset

def get_svd_recommendations(user_id, top_n, svd_model, trainset):
    testset = trainset.build_anti_testset()
    predictions = svd_model.test(filter(lambda x: x[0] == user_id, testset))
    predictions.sort(key=lambda x: x.est, reverse=True)
    return [pred.iid for pred in predictions[:top_n]]

# Neural Collaborative Filtering (NCF)
def build_ncf_model(data):
    user_ids = data['user_id'].unique()
    product_ids = data['Product ID'].unique()

    user_map = {u: i for i, u in enumerate(user_ids)}
    product_map = {p: i for i, p in enumerate(product_ids)}

    data['user_index'] = data['user_id'].map(user_map)
    data['product_index'] = data['Product ID'].map(product_map)

    num_users = len(user_ids)
    num_products = len(product_ids)

    user_input = Input(shape=(1,))
    product_input = Input(shape=(1,))
    user_embedding = Flatten()(Embedding(num_users, 50)(user_input))
    product_embedding = Flatten()(Embedding(num_products, 50)(product_input))
    dot_product = Dot(axes=1)([user_embedding, product_embedding])
    concat = Concatenate()([user_embedding, product_embedding])
    dense = Dense(64, activation='relu')(concat)
    output = Dense(1, activation='linear')(dense)

    ncf_model = Model([user_input, product_input], output)
    ncf_model.compile(optimizer='adam', loss='mean_squared_error')
    ncf_model.fit([data['user_index'], data['product_index']], data['Rating'], epochs=5, batch_size=32)
    return ncf_model, user_map, product_map

def get_ncf_recommendations(user_id, top_n, ncf_model, user_map, product_map):
    user_idx = user_map[user_id]
    num_products = len(product_map)
    product_scores = ncf_model.predict([tf.constant([user_idx] * num_products), tf.constant(range(num_products))])
    product_indices = product_scores.numpy().flatten().argsort()[::-1][:top_n]
    product_ids = list(product_map.keys())
    return [product_ids[i] for i in product_indices]

# Hybrid Model
def hybrid_recommendation(user_id, product_id, top_n, content_similarity, content_df, svd_model, trainset, ncf_model, user_map, product_map, alpha=0.4, beta=0.3, gamma=0.3):
    content_recs = get_content_recommendations(product_id, top_n, content_similarity, content_df)
    svd_recs = get_svd_recommendations(user_id, top_n, svd_model, trainset)
    ncf_recs = get_ncf_recommendations(user_id, top_n, ncf_model, user_map, product_map)

    scores = {rec: alpha for rec in content_recs}
    for rec in svd_recs:
        scores[rec] = scores.get(rec, 0) + beta
    for rec in ncf_recs:
        scores[rec] = scores.get(rec, 0) + gamma

    sorted_recs = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [rec[0] for rec in sorted_recs[:top_n]]

# Run models
content_similarity, content_df = build_tfidf_model(data)
svd_model, trainset = build_svd_model(data)
ncf_model, user_map, product_map = build_ncf_model(data)

# Example recommendation
user_id = "example_user_id"
product_id = "example_product_id"
recommendations = hybrid_recommendation(user_id, product_id, 10, content_similarity, content_df, svd_model, trainset, ncf_model, user_map, product_map)
print("Hybrid Recommendations:", recommendations)
