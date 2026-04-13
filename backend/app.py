from flask import Flask, request, jsonify
from flask_cors import CORS
from predict import predict_pothole
from datetime import datetime
import json, os

app = Flask(__name__)

# ✅ FIXED CORS (allow all origins for now)
CORS(app, resources={r"/*": {"origins": "*"}})

MARKERS_FILE = "markers.json"


def load_markers():
    if os.path.exists(MARKERS_FILE):
        with open(MARKERS_FILE) as f:
            return json.load(f)
    return []


def save_markers(markers):
    with open(MARKERS_FILE, "w") as f:
        json.dump(markers, f)


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        result = predict_pothole(file)
        return jsonify(result)
    except Exception as e:
        print(f"[ERROR] {e}")  # 🔍 debug log
        return jsonify({"error": str(e)}), 500


@app.route("/markers", methods=["GET"])
def get_markers():
    return jsonify(load_markers())


@app.route("/markers", methods=["POST"])
def add_marker():
    markers = load_markers()
    data = request.get_json()

    new_marker = {
        "id": len(markers) + 1,
        "lat": data["lat"],
        "lng": data["lng"],
        "severity": data["severity"],
        "confidence": data["confidence"],
        "timestamp": data.get("timestamp", datetime.now().isoformat()),
    }

    markers.append(new_marker)
    save_markers(markers)
    return jsonify(new_marker), 201


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)