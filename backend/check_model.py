# check_model.py
import pickle
from pathlib import Path

MODEL_PATH = "backend_model.pkl"
VECT_PATH = "backend_vectorizer.pkl"

# load
model = pickle.load(open(MODEL_PATH, "rb"))
vectorizer = pickle.load(open(VECT_PATH, "rb"))

# replace with the exact text you typed in the frontend
test_text = """The Indian Space Research Organisation (ISRO) has successfully launched
its latest communication satellite GSAT-30 from the Guiana Space Centre, aiming to improve
telecommunication and broadcasting services across India."""

# simple cleaning (same as train)
import re
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'http\S+|www\.\S+', ' ', text)
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

cleaned = clean_text(test_text)
vec = vectorizer.transform([cleaned])

print("Cleaned text:", cleaned)
print("Nonzero TF-IDF features (nnz):", vec.nnz)
print("Vector shape:", vec.shape)

pred = model.predict(vec)
print("Prediction (numeric):", pred)

if hasattr(model, "predict_proba"):
    proba = model.predict_proba(vec)[0]
    print("Probabilities:", proba)
else:
    # show decision score if no predict_proba
    try:
        df = model.decision_function(vec)
        print("Decision function:", df)
    except Exception as e:
        print("No decision_function available:", e)
