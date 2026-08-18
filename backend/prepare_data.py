import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import pickle
import os
import time

# 🕐 Helper for printing stylish progress
def step(msg, symbol="⚙️"):
    print(f"{symbol} {msg}")
    time.sleep(0.5)  # small delay so steps feel smooth

# ========== Load dataset ==========
data_path = os.path.join("Data", "combined_dataset.csv")
step(f"Loading dataset from: {data_path}", "📂")

df = pd.read_csv(data_path, encoding='utf-8', on_bad_lines='skip')
print(f"✅ Dataset loaded successfully! Total rows: {len(df)}")
print("📰 Columns found:", df.columns.tolist())

# ========== Clean dataset ==========
step("Cleaning data...", "🧹")
if 'content' not in df.columns:
    df.rename(columns={df.columns[0]: 'content'}, inplace=True)
if 'label' not in df.columns:
    df.rename(columns={df.columns[-1]: 'label'}, inplace=True)

df = df.dropna(subset=['content', 'label'])
df = df[df['content'].str.strip() != '']

print(f"✅ Cleaned data: {len(df)} valid rows remaining.")

# ========== Split data ==========
step("Splitting dataset into training and testing sets...", "✂️")
X_train, X_test, y_train, y_test = train_test_split(
    df['content'], df['label'], test_size=0.2, random_state=42
)
print(f"📊 Train size: {len(X_train)} | Test size: {len(X_test)}")

# ========== Vectorize ==========
step("Converting text to numerical features using TF-IDF...", "🔤")
vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)
print("✅ Text vectorization complete!")

# ========== Train model ==========
step("Training Logistic Regression model...", "🤖")
model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)
print("✅ Model training complete!")

# ========== Evaluate ==========
step("Evaluating model performance...", "📈")
y_pred = model.predict(X_test_vec)
acc = accuracy_score(y_test, y_pred)
print(f"🎯 Accuracy: {acc*100:.2f}%")

# ========== Save model ==========
step("Saving model and vectorizer...", "💾")
with open("backend_model.pkl", "wb") as f:
    pickle.dump(model, f)
with open("backend_vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)
print("🎉 Model and vectorizer saved successfully!")

print("\n✨ All done, Deepali! Your AI model is ready to power NewsGuard 🚀")
