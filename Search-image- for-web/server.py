import numpy as np
from PIL import Image
import requests
from feature_extractor import FeatureExtractor
from datetime import datetime
from flask import Flask, request, render_template
from pathlib import Path
from flask_cors import CORS
from pymongo import MongoClient
from offline import train_image, train
from congif import SERVER_URL 



app = Flask(__name__)
CORS(app)

#Connect to MongoDB
client = MongoClient('mongodb+srv://20521131:hazakachi69@cluster0.ncbaliy.mongodb.net/Watch_shop?retryWrites=true&w=majority&appName=Cluster0')
db = client["Watch_shop"] 
collection = db["watches"]

# Read image features
fe = FeatureExtractor()
features = []
img_ids = []
train()
for feature_path in Path("static/feature").glob("*.npy"):
    features.append(np.load(feature_path))
    img_id = "/product/images/" + feature_path.stem + ".png"

    watch = collection.find_one({"image": img_id})

    img_ids.append(watch)

print(len(img_ids))
print(len(features))
# fe = FeatureExtractor()
# features = []
# img_paths = []
# for feature_path in Path("./static/feature").glob("*.npy"):
#     features.append(np.load(feature_path))
#     # img_paths.append(Path("./static/img") / (feature_path.stem + ".jpg"))
#     img_ids = "/images/" + feature_path.stem + ".png"
#     watch = collection.find_one({"image": img_id})
#     img_ids.append(watch)
# print(len(img_ids))
# print(len(features))
# features = np.array(features)


@app.post("/retrain")
def retrain():
    global features
    global img_ids

    image_filename = request.form["image_filename"]

    print(image_filename)
    train_result = train_image(image_filename)
    if train_result["status"] == "success":
        feature_path = train_result["feature_path"]

        img_id = "/images/" + image_filename

        print(img_id)

        watch = collection.find_one({"image": img_id})
        img_ids.append(watch)

        print(feature_path)

        features.append(np.load(feature_path))

        print("Retrain success")
        return {"status": "retrain success"}
    else:
        print("Train fail")
        return {"status": "retrain fail"}

#@app.route('/', methods=['GET', 'POST'])
# def index():
#     if request.method == 'POST':
#         file = request.files['query_img']

#         # Save query image
#         img = Image.open(file.stream)  # PIL image
#         uploaded_img_path = "static/uploaded/" + datetime.now().isoformat().replace(":", ".") + "_" + file.filename
#         img.save(uploaded_img_path)

#         # Run search
#         query = fe.extract(img)
#         dists = np.linalg.norm(features-query, axis=1)  # L2 distances to features
#         ids = np.argsort(dists)[:30]  # Top 30 results
#         scores = [(dists[id], img_paths[id]) for id in ids]

#         return render_template('index.html',
#                                query_path=uploaded_img_path,
#                                scores=scores)
#     else:
#         return render_template('index.html')
@app.post("/imagesearch")
def index():
    global features
    global img_ids
    copy_features = features.copy()
   # Lấy tệp từ request
    if 'query_img' not in request.form:
        return {"error": "No image part"}, 400
    file = request.form['query_img']
    image_filename = request.form["query_img"]
    print(image_filename)
    image_url = "http://localhost:5000/imagesearchstorage/" + image_filename

    # Fetch image from URL
    img = Image.open(requests.get(image_url, stream=True).raw)
    img = img.convert("RGB")
    img = img.resize((224, 224))

    # Save query image
    uploaded_img_path = (
        "static/uploaded/"
        + datetime.now().isoformat().replace(":", ".")
        + "_"
        + image_filename
    )
    img.save(uploaded_img_path)

    # Run search
    query = fe.extract(img)

    # L2 distances to features
    dists = []
    # dists = np.linalg.norm(features - query, axis=(1, 2))
    for feature in copy_features:
        dists.append(np.linalg.norm(feature - query))
    dists = np.array(dists)
    print(dists)

    ids = np.argsort(dists)[:8]  # Top 8 results

    print(ids)

    scores = []

    for id in ids:
        try:
            print(id)
            print(img_ids[id])
            print(img_ids[id]["id"])
            scores.append(img_ids[id]["id"])
        except:
            print("Error", id)
            continue

    return {"scores": scores}


if __name__ == "__main__":
    app.run(port=1234)
    print("Server is running")