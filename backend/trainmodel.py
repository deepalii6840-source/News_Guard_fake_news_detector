import pandas as pd
import os
import re
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"\n", " ", text)
    return " ".join(text.split())

# Load datasets
data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Data")
true_df = pd.read_csv(os.path.join(data_dir, "True.csv"))[['text']].copy()
true_df['label'] = 1
fake_df = pd.read_csv(os.path.join(data_dir, "Fake.csv"))[['text']].copy()
fake_df['label'] = 0

df = pd.concat([true_df, fake_df], ignore_index=True)
df['text'] = df['text'].apply(clean_text)
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    df['text'], df['label'], test_size=0.2, stratify=df['label'], random_state=42
)

# Vectorize
vectorizer = TfidfVectorizer(max_features=10000, ngram_range=(1,2))
X_train_vect = vectorizer.fit_transform(X_train)
X_test_vect = vectorizer.transform(X_test)

# Train Logistic Regression
lr_model = LogisticRegression(max_iter=500, class_weight='balanced', random_state=42)
lr_model.fit(X_train_vect, y_train)

# Train Random Forest
rf_model = RandomForestClassifier(n_estimators=100, class_weight='balanced', random_state=42)
rf_model.fit(X_train_vect, y_train)

# Save the models and vectorizer
models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
os.makedirs(models_dir, exist_ok=True)

with open(os.path.join(models_dir, "lr_model.pkl"), "wb") as f:
    pickle.dump(lr_model, f)
with open(os.path.join(models_dir, "rf_model.pkl"), "wb") as f:
    pickle.dump(rf_model, f)
with open(os.path.join(models_dir, "tfidf_vectorizer.pkl"), "wb") as f:
    pickle.dump(vectorizer, f)

print("Models and vectorizer saved successfully!")
