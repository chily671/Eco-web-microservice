import schedule
import time
import requests
import pandas as pd

def extract():
    try:
        # Lấy dữ liệu từ các dịch vụ
        users_response = requests.get("http://localhost:5001/allusers")
        products_response = requests.get("http://localhost:5000/allproduct")
        
        # Kiểm tra mã trạng thái HTTP của phản hồi
        if users_response.status_code == 200:
            users = users_response.json()  # Giả sử trả về dữ liệu JSON
        else:
            print(f"Lỗi khi lấy dữ liệu người dùng. Mã trạng thái: {users_response.status_code}")
            return None, None
        
        if products_response.status_code == 200:
            products = products_response.json()  # Giả sử trả về dữ liệu JSON
        else:
            print(f"Lỗi khi lấy dữ liệu sản phẩm. Mã trạng thái: {products_response.status_code}")
            return None, None
        
        if isinstance(users, list) and isinstance(products, list):
            users_df = pd.DataFrame(users)
            products_df = pd.DataFrame(products)
            print("Dữ liệu người dùng:")
            print(users_df.head(10))  # Hiển thị 10 dòng đầu tiên của dữ liệu người dùng

            print("\nDữ liệu sản phẩm:")
            print(products_df.head(10))  # Hiển thị 10 dòng đầu tiên của dữ liệu sản phẩm
        else:
            print("Dữ liệu không hợp lệ từ API.")
            return None, None
        
        return users_df, products_df

    except Exception as e:
        print(f"Lỗi khi kết nối API: {e}")
        return None, None


def transform(users_df, products_df):
    if users_df is None or products_df is None:
        print("Không có dữ liệu để xử lý.")
        return None
    
    order_data_list = []
    for _, user in users_df.iterrows():  # Lặp qua các dòng của DataFrame users_df
        for product_id in user['orderData']:  # Lặp qua các product_id trong 'orderData'
            product = products_df[products_df['id'] == product_id]
            if not product.empty:
                product_info = product.iloc[0]
                order_data_list.append({
                    'user_id': user['_id'],  # Dùng user từ mỗi dòng
                    'Product ID': product_info['id'],
                    'Product Name': product_info['name'],
                    'Price': product_info['price'],
                    'Brand': product_info['brand'],
                    'Rating': product_info['rating']
                })
    
    
    combined_df = pd.DataFrame(order_data_list)
    # Thêm cột index
    combined_df = combined_df.reset_index()
    print("\nDữ liệu sau khi gộp:")
    print(combined_df.head(10))  # Hiển thị 10 dòng đầu tiên của dữ liệu đã gộp
    return combined_df


def load(combined_data):
    if combined_data is None:
        print("Không có dữ liệu để lưu.")
        return
    
    # Lưu dữ liệu vào file CSV
    combined_data.to_csv("aggregated_for_recommender.csv", index=False)
    print("\nDữ liệu đã được lưu vào file 'aggregated_for_recommender.csv'.")
    print("Dữ liệu trong file CSV:")
    print(combined_data.head(10))  # In ra 10 dòng đầu tiên của dữ liệu đã lưu


def etl_process():
    users_df, products_df = extract()  # Lấy dữ liệu
    if users_df is None or products_df is None:
        print("Không có dữ liệu để thực hiện quy trình ETL.")
        return
    combined_data = transform(users_df, products_df)  # Gộp dữ liệu
    load(combined_data)  # Lưu dữ liệu


if __name__ == "__main__":
   etl_process()
