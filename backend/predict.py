import numpy as np
from PIL import Image
import io
import os
import tensorflow as tf

# ── Model path ────────────────────────────────────────────────────────────────
MODEL_PATH = "pothole_model.h5"


# ── Load model (STRICT) ───────────────────────────────────────────────────────
def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"❌ Model file NOT FOUND at {MODEL_PATH}")

    print(f"[INFO] Loading saved model from {MODEL_PATH}")
    return tf.keras.models.load_model(MODEL_PATH)


# Load once at startup
model = load_model()


# ── Preprocessing ─────────────────────────────────────────────────────────────
def preprocess(file) -> np.ndarray:
    """Read uploaded file, resize to 224×224, normalise to [0,1]."""
    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    img = img.resize((224, 224))
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)   # shape: (1, 224, 224, 3)


# ── Public API ────────────────────────────────────────────────────────────────
def predict_pothole(file) -> dict:
    """
    Returns:
        { "detected": bool, "confidence": float (0-100) }
    """
    img = preprocess(file)

    raw = float(model.predict(img, verbose=0)[0][0])
    print(f"[DEBUG] Raw prediction: {raw}")   # 🔥 IMPORTANT DEBUG

    detected = raw >= 0.3
    confidence = round(raw * 100, 2)

    return {
        "detected": detected,
        "confidence": confidence,
        "raw_score": round(raw, 4),
    }