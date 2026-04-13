import numpy as np
from PIL import Image
import io
import os
import tensorflow as tf

# ✅ Disable GPU (important for Render stability)
tf.config.set_visible_devices([], 'GPU')

# ── Model path ────────────────────────────────────────────────────────────────
MODEL_PATH = "pothole_model.h5"


# ── Load model (STRICT) ───────────────────────────────────────────────────────
def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"❌ Model file NOT FOUND at {MODEL_PATH}")

    print(f"[INFO] Loading saved model from {MODEL_PATH}")
    model = tf.keras.models.load_model(MODEL_PATH)

    # ✅ IMPORTANT: Freeze for inference (reduces memory)
    model.trainable = False

    return model


# Load once at startup
model = load_model()


# ── Preprocessing ─────────────────────────────────────────────────────────────
def preprocess(file) -> np.ndarray:
    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

    # ⚠️ keep 224 (matches training)
    img = img.resize((224, 224))

    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)


# ── Public API ────────────────────────────────────────────────────────────────
def predict_pothole(file) -> dict:
    img = preprocess(file)

    # ✅ LIGHTWEIGHT inference (NO predict())
    raw = float(model(img, training=False).numpy()[0][0])

    print(f"[DEBUG] Raw prediction: {raw}")

    detected = raw >= 0.3
    confidence = round(raw * 100, 2)

    return {
        "detected": detected,
        "confidence": confidence,
        "raw_score": round(raw, 4),
    }