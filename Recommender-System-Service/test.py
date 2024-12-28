import pandas as pd
from surprise import SVD, Dataset, Reader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.metrics import mean_squared_error
from math import sqrt
import matplotlib.pyplot as plt
import numpy as np

# Load dữ liệu
data = pd.read_csv('fashion_products.csv')

# Chuẩn bị dữ liệu
reader = Reader(rating_scale=(1, 5))
surprise_data = Dataset.load_from_df(data[['Product ID', 'Product Name', 'Branch' 'Rating']], reader)
trainset = surprise_data.build_full_trainset()

# Content-based filtering
content_df = data[['Product ID', 'Product Name', 'Brand', 'Price']].drop_duplicates()
content_df['content'] = content_df.apply(lambda row: ' '.join(row.dropna().astype(str)), axis=1)
tfidf_vectorizer = TfidfVectorizer()
content_matrix = tfidf_vectorizer.fit_transform(content_df['content'])
content_similarity = linear_kernel(content_matrix, content_matrix)

# Collaborative filtering
algo = SVD()
algo.fit(trainset)

# Hàm dự đoán và so sánh
def get_content_recommendations(product_id, top_n=5):
    index = content_df[content_df['Product ID'] == product_id].index
    if len(index) == 0:
        return []
    index = index[0]
    similarity_scores = content_similarity[index]
    similar_indices = similarity_scores.argsort()[::-1][1:top_n+1]
    return content_df.iloc[similar_indices]['Product ID'].values

def get_collaborative_recommendations(user_id, top_n=5):
    testset = trainset.build_anti_testset()
    testset = filter(lambda x: x[0] == user_id, testset)
    predictions = algo.test(testset)
    predictions.sort(key=lambda x: x.est, reverse=True)
    return [pred.iid for pred in predictions[:top_n]]

# Đánh giá bằng RMSE
def evaluate_recommendations():
    testset = trainset.build_testset()
    predictions = algo.test(testset)
    rmse = sqrt(mean_squared_error([pred.r_ui for pred in predictions], [pred.est for pred in predictions]))
    return rmse

# So sánh và trực quan hóa
def visualize_comparison():
    methods = ['Content-based', 'Collaborative', 'Hybrid']
    scores = []
    for method in methods:
        if method == 'Content-based':
            # Giả sử một số sản phẩm và so sánh
            sample_product = content_df['Product ID'].iloc[0]
            recommendations = get_content_recommendations(sample_product, top_n=5)
            scores.append(len(recommendations))  # Ví dụ: số lượng gợi ý
        elif method == 'Collaborative':
            sample_user = data['user_id'].iloc[0]
            recommendations = get_collaborative_recommendations(sample_user, top_n=5)
            scores.append(len(recommendations))
        elif method == 'Hybrid':
            sample_user = data['user_id'].iloc[0]
            sample_product = content_df['Product ID'].iloc[0]
            hybrid_recommendations = set(get_content_recommendations(sample_product, top_n=3) + 
                                         get_collaborative_recommendations(sample_user, top_n=3))
            scores.append(len(hybrid_recommendations))
    
    plt.bar(methods, scores, color=['blue', 'green', 'orange'])
    plt.title("Comparison of Recommendation Methods")
    plt.xlabel("Methods")
    plt.ylabel("Number of Recommendations")
    plt.show()

# Gọi hàm đánh giá
rmse = evaluate_recommendations()
print(f"RMSE of Collaborative Filtering: {rmse}")

# Gọi hàm trực quan hóa
visualize_comparison()
