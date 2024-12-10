import os
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def fetch_image_urls_selenium(query, max_images=5):
    # Khởi tạo trình duyệt Chrome
    driver = webdriver.Chrome()  # Cần cài đặt ChromeDriver
    url = f"https://www.google.com/search?q={query}&tbm=isch"
    driver.get(url)

    # Đợi cho đến khi ít nhất một hình ảnh xuất hiện
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "img")))

    # Cuộn trang xuống để tải thêm hình ảnh
    for _ in range(3):  # Cuộn trang 3 lần để tải thêm hình ảnh
        driver.execute_script("window.scrollBy(0,1000)")  # Cuộn trang xuống
        time.sleep(2)  # Đợi trang tải thêm hình ảnh

    # Lấy tất cả ảnh hiển thị
    image_elements = driver.find_elements(By.CSS_SELECTOR, "img")
    image_urls = []
    
    for img in image_elements[:max_images]:
        src = img.get_attribute("src")
        srcset = img.get_attribute("srcset")  # Lấy srcset nếu có
        data_src = img.get_attribute("data-src")  # Lấy data-src nếu có
        
        # Chọn URL hợp lệ từ srcset hoặc data-src nếu có, nếu không dùng src
        image_url = srcset or data_src or src
        
        # Kiểm tra src hợp lệ, không phải base64 hoặc placeholder
        if image_url and image_url != "data:image/png;base64,..." and image_url.startswith("http"):
            image_urls.append(image_url)

    driver.quit()
    return image_urls

def save_image(url, folder, filename):
    try:
        # Tải ảnh từ URL
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            # Lưu ảnh vào thư mục
            with open(os.path.join(folder, filename), 'wb') as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)
            print(f"Lưu hình ảnh thành công: {filename}")
        else:
            print(f"Lỗi khi tải ảnh (HTTP {response.status_code}): {url}")
    except Exception as e:
        print(f"Lỗi khi lưu hình ảnh: {e}")

def main():
    products = ["Rolex Watch", "Omega Watch", "Seiko Watch"]
    output_folder = "img"
    os.makedirs(output_folder, exist_ok=True)  # Tạo thư mục nếu chưa có

    for product_name in products:
        print(f"Tìm kiếm hình ảnh cho sản phẩm: {product_name}")
        image_urls = fetch_image_urls_selenium(product_name)

        for idx, img_url in enumerate(image_urls, start=1):
            sanitized_name = product_name.replace(" ", "_")  # Xử lý khoảng trắng trong tên sản phẩm
            filename = f"{sanitized_name}_{idx}.png"
            save_image(img_url, output_folder, filename)

if __name__ == "__main__":
    main()
