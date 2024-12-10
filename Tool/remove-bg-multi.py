import os
from rembg import remove
from PIL import Image, UnidentifiedImageError
import io

# Đường dẫn đến thư mục chứa ảnh gốc
input_folder = '../Products-service/upload/images'

# Duyệt qua từng file trong thư mục
for filename in os.listdir(input_folder):
    if filename.endswith('.png'):
        input_path = os.path.join(input_folder, filename)

        try:
            # Mở file, đọc dữ liệu binary và chuyển đổi sang đối tượng Image
            with open(input_path, 'rb') as input_file:
                input_data = input_file.read()
                input_image = Image.open(io.BytesIO(input_data))  # Chuyển đổi dữ liệu binary thành đối tượng Image
                input_image = input_image.convert("RGBA")  # Đảm bảo định dạng RGBA

                # Xóa nền
                output_image = remove(input_image)
            
                # Ghi đè ảnh đã remove background lên ảnh gốc
                output_image.save(input_path, 'PNG')
            
            print(f"Đã xử lý xong {filename}")

        except UnidentifiedImageError:
            print(f"Không thể nhận dạng file ảnh {filename}. Bỏ qua file này.")
