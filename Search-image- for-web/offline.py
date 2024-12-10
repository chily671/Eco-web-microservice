from PIL import Image
from feature_extractor import FeatureExtractor
from pathlib import Path
import numpy as np
import os
from pymongo import MongoClient
import requests

#Connect to MongoDB
client = MongoClient('mongodb+srv://20521131:hazakachi69@cluster0.ncbaliy.mongodb.net/Watch_shop?retryWrites=true&w=majority&appName=Cluster0')
db = client["Watch_shop"]
collection = db["watches"]
watches = collection.find()

    
def train():
    fe = FeatureExtractor()

    for watch in watches:
        try:
            img_path = watch['image']
            img_path = img_path.replace("/product/", "")
            print(f"Processing: {img_path}") # e.g., ./product/images/xxx.png
            feature = fe.extract(img=Image.open(requests.get("http://localhost:5000/" + img_path, stream=True).raw))

            # Tạo đường dẫn đến thư mục static/feature
            feature_dir = Path("static/feature")

            img_path = img_path.split('/')[-1]

            img_path = img_path.split('.')[0]

            # Tạo đường dẫn cho file feature
            feature_path = feature_dir / (img_path + ".npy")

            print(feature_path)

            # Tạo thư mục nếu nó chưa tồn tại
            feature_dir.mkdir(parents=True, exist_ok=True)

            # Ghi đè feature lên file nếu nó đã tồn tại, hoặc tạo mới nếu chưa có
            np.save(feature_path, feature)
        except:
            continue

def train_image(image_filename):

    print(image_filename)

    image_path = "/images/" + image_filename

    try:
        fe = FeatureExtractor()
        feature = fe.extract(img=Image.open(requests.get("http://localhost:5000" + image_path, stream=True).raw))
        feature_dir = Path("static/feature")
        feature_path = feature_dir / (image_filename.split('.')[0] + ".npy")
        feature_dir.mkdir(parents=True, exist_ok=True)
        np.save(feature_path, feature)
        print("Train_image success")
        return {"status": "success", "feature_path": feature_path}
    
    except:
        print("Train_image fail")
        return {"status": "fail"}
if __name__ == "__main__":
    train()