import os
import requests
from serpapi import GoogleSearch

def search_images(product_name):
    params = {
        "engine": "google",
        "q": product_name,
        "tbm": "isch",
        "api_key": "YOUR_SERPAPI_KEY"  # Thay bằng API key của bạn
    }

    search = GoogleSearch(params)
    results = search.get_dict()
    print("Kết quả trả về từ API:", results)  # Kiểm tra dữ liệu API
    images_results = results.get("images_results", [])

    if not images_results:
        print(f"Không tìm thấy hình ảnh cho sản phẩm: {product_name}")
    
    image_urls = [img["thumbnail"] for img in images_results[:5]]
    return image_urls

def save_image(url, folder, filename):
    print(f"Đang tải ảnh từ URL: {url}")
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        file_path = os.path.join(folder, filename)
        with open(file_path, 'wb') as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)
        print(f"Lưu thành công: {file_path}")
    else:
        print(f"Lỗi khi tải ảnh từ URL: {url} - Mã lỗi: {response.status_code}")

def main():
    products = ["Rolex Watch", "Omega Watch", "Seiko Watch"]
    output_folder = "img"
    os.makedirs(output_folder, exist_ok=True)

    for product_name in products:
        print(f"Tìm kiếm hình ảnh cho sản phẩm: {product_name}")
        image_urls = search_images(product_name)
        print(f"URLs hình ảnh cho {product_name}: {image_urls}")

        for idx, img_url in enumerate(image_urls, start=1):
            filename = f"{product_name.replace(' ', '_')}_{idx}.png"
            save_image(img_url, output_folder, filename)

if __name__ == "__main__":
    main()
