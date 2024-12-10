import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Embedding, Flatten
from tensorflow.keras.optimizers import Adam

# Load data
data = pd.read_csv('/mnt/data/data.csv')

# Làm sạch và chuẩn hóa dữ liệu
data = data.dropna()  # Loại bỏ các giá trị thiếu
data['price'] = data['price'].astype(float)  # Chuyển đổi price thành số thực

# Encode categorical features
categorical_features = ['brand', 'model', 'mvmt', 'casem', 'bracem', 'yop', 'condition', 'sex', 'size']
le = LabelEncoder()
for col in categorical_features:
    data[col] = le.fit_transform(data[col])

# TF-IDF cho các thuộc tính văn bản
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(data['name'])

# Kết hợp dữ liệu
svd = TruncatedSVD(n_components=50)
svd_features = svd.fit_transform(tfidf_matrix)

# Tách dữ liệu cho huấn luyện và kiểm tra
X = svd_features
y = data['price']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Xây dựng mô hình NCF
model = Sequential([
    Embedding(input_dim=50, output_dim=50, input_length=svd_features.shape[1]),
    Flatten(),
    Dense(128, activation='relu'),
    Dense(1)
])

model.compile(optimizer=Adam(), loss='mean_squared_error', metrics=['mean_absolute_error'])
model.fit(X_train, y_train, epochs=20, batch_size=128, validation_split=0.2)

# Dự đoán và đánh giá hiệu suất
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))

print(f'Mean Absolute Error: {mae:.4f}')
print(f'Root Mean Squared Error: {rmse:.4f}')
