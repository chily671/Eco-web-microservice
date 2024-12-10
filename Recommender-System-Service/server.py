import pandas as pd
from surprise import Reader, Dataset, SVD
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import requests
from flask import Flask, request
from datetime import datetime
from pathlib import Path
from flask_cors import CORS
from pymongo import MongoClient
from data import etl_process

app = Flask(__name__)
CORS(app)


data = pd.read_csv('aggregated_for_recommender.csv')
data.head(20)

#content based filtering
content_df = data[['Product ID', 'Product Name', 'Brand', 'Price' ]]
content_df.loc[:, 'content'] = content_df.apply(lambda row: ' '.join(row.dropna().astype(str)), axis=1)

# use tf-idf to vectorize the content into a matrix of matrix of tf-idf features
tfidf_vectorizer = TfidfVectorizer()
content_matrix = tfidf_vectorizer.fit_transform(content_df['content'])

content_similarity = linear_kernel(content_matrix, content_matrix)

reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(data[['user_id', 'Product ID', 'Rating']], reader)

def get_content_based_recommendations(product_id, top_n):
    product_id = str(product_id)
    index = content_df[content_df['Product ID'].astype(str) == product_id].index
    if len(index) == 0:
        print(f"Không tìm thấy sản phẩm với ID {product_id}.")
        return []

    # Lấy chỉ số đầu tiên (nếu có nhiều hơn một)
    index = index[0]
    similarity_scores = content_similarity[index]
    similar_indices = similarity_scores.argsort()[::-1][1:top_n+1] 
    recommendations = content_df.loc[similar_indices, 'Product ID'].values  
    return recommendations.tolist() 



# collaborative filtering
algo = SVD() #Mô hình SVD (Singular Value Decomposition) là mô hình chung 
trainset = data.build_full_trainset() #Tạo tập dữ liệu huấn luyện từ dữ liệu (laays fasion_products.csv)
algo.fit(trainset)

def get_collaborative_filtering_recommendations(userId, top_n):
    testset = trainset.build_anti_testset()
    testset = filter(lambda x: x[0] == userId, testset)
    predictions = algo.test(testset)
    predictions.sort(key=lambda x: x.est, reverse=True)
    recommendations = [prediction.iid for prediction in predictions[:top_n]]
    return recommendations

# hybrid approach
def hybrid_filtering(user_id, product_id, top_n):
    content_based_recommendations = get_content_based_recommendations(product_id, top_n)
    collaborative_filtering_recommendations = get_collaborative_filtering_recommendations(user_id, top_n)
    hybrid_recommendations = list(set(content_based_recommendations + collaborative_filtering_recommendations))
    return hybrid_recommendations[:top_n]

def get_first_product_of_user(user_id, combined_df):
    # Chuyển đổi user_id và combined_df['user_id'] thành chuỗi và loại bỏ khoảng trắng
    user_id = str(user_id).strip()
    combined_df['user_id'] = combined_df['user_id'].astype(str).str.strip()
    
    print(f"Debug: Checking for user_id: '{user_id}'")
    print(f"Debug: Available user_ids: {combined_df['user_id'].tolist()}")  # In ra tất cả các user_id
    
    # Thử so sánh từng phần tử để kiểm tra sự khác biệt
    for idx, uid in enumerate(combined_df['user_id']):
        if uid == user_id:
            print(f"Debug: Match found for user_id at index {idx}")
    
    # Lọc dữ liệu theo user_id
    user_data = combined_df[combined_df['user_id'] == user_id]
    
    # Kiểm tra xem có dữ liệu cho user_id không
    if user_data.empty:
        print(f"Debug: No data found for user_id '{user_id}'")
        return None
    
    # Nếu có, lấy product_id đầu tiên
    first_product_id = user_data.iloc[0]['Product ID']
    print(f"Debug: Found first product ID '{first_product_id}' for user_id '{user_id}'")
    return first_product_id



@app.post("/recommend")
def index():
    
    user_id = request.json["user_id"].strip('"')
    combined_df = pd.read_csv('aggregated_for_recommender.csv')
    product_id = get_first_product_of_user(user_id, combined_df)
    print(f"Recommendations for user {user_id}:")
    print(f"sản phẩm đầu tiên của mỗi người dùng: {product_id}")
    top_n = 8
    recommendations = hybrid_filtering(user_id, product_id, top_n)
    print(recommendations)
    return recommendations


@app.post("/loaddata")
def load_data():
    etl_process()
    return {"message": "Data loaded successfully"}


if __name__ == "__main__":
    app.run(port=1357)
    print("Server RS is running")