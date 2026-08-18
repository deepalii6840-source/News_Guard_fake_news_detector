from flask import Flask, request, jsonify
import pickle
import os
import numpy as np
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- Utility: Clean text ---
def clean_text(text):
    text = str(text).lower()
    text = text.replace('\n', ' ')
    text = ' '.join(text.split())
    return text

# --- Load models and vectorizer ---
models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
with open(os.path.join(models_dir, 'rf_model.pkl'), 'rb') as f:
    rf_model = pickle.load(f)
with open(os.path.join(models_dir, 'lr_model.pkl'), 'rb') as f:
    lr_model = pickle.load(f)
with open(os.path.join(models_dir, 'tfidf_vectorizer.pkl'), 'rb') as f:
    vectorizer = pickle.load(f)

# --- Prediction endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = data.get("text", "")
    model_type = data.get("model_type", "rf")  # default is random forest

    cleaned = clean_text(text)
    X = vectorizer.transform([cleaned])

    if model_type == "rf":
        model = rf_model
        label_name = "Random Forest"
    elif model_type == "lr":
        model = lr_model
        label_name = "Logistic Regression"
    else:
        return jsonify({"error": "Invalid model_type, use 'rf' or 'lr'."}), 400

    pred = int(model.predict(X)[0])
    label = "Reliable (True News)" if pred == 1 else "Unreliable (Fake News)"
    try:
        confidence = round(float(np.max(model.predict_proba(X))) * 100, 2)
    except AttributeError:
        confidence = None

    return jsonify({
        "algorithm": label_name,
        "prediction": label,
        "confidence": confidence
    })

# --- Comparison endpoint ---
@app.route('/compare', methods=['POST'])
def compare():
    data = request.get_json()
    text = data.get("text", "")

    cleaned = clean_text(text)
    X = vectorizer.transform([cleaned])

    # Random Forest
    pred_rf = int(rf_model.predict(X)[0])
    label_rf = "Reliable (True News)" if pred_rf == 1 else "Unreliable (Fake News)"
    try:
        conf_rf = round(float(np.max(rf_model.predict_proba(X))) * 100, 2)
    except AttributeError:
        conf_rf = None

    # Logistic Regression
    pred_lr = int(lr_model.predict(X)[0])
    label_lr = "Reliable (True News)" if pred_lr == 1 else "Unreliable (Fake News)"
    try:
        conf_lr = round(float(np.max(lr_model.predict_proba(X))) * 100, 2)
    except AttributeError:
        conf_lr = None

    return jsonify({
        "random_forest": {"prediction": label_rf, "confidence": conf_rf},
        "logistic_regression": {"prediction": label_lr, "confidence": conf_lr}
    })

if __name__ == "__main__":
    app.run(debug=True)
