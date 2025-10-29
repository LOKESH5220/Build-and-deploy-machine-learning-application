from flask import Flask, request, jsonify, send_from_directory
import joblib
from flask_cors import CORS
import numpy as np
import os

# Disable Flask's automatic static file handling so our custom /static route takes effect
app = Flask(__name__, static_folder=None)
CORS(app) 
# Load trained model
model = joblib.load('heart_svm_pca_model.pkl')

# Expected feature names
feature_names = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
                 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    # Extract and validate features
    try:
        features = [float(data[name]) for name in feature_names]
    except KeyError:
        return jsonify({'error': 'Missing feature in input'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid input type'}), 400

    features_np = np.array(features).reshape(1, -1)

    # Predict probability and class
    pred = model.predict(features_np)[0]
    proba = model.predict_proba(features_np)[0]
    
    # Get probability of heart disease (class 1)
    disease_prob = proba[1] if len(proba) > 1 else proba[0]
    
    response = {
        'prediction': int(pred),
        'probability': round(disease_prob, 3),
        'message': 'Heart disease detected' if pred == 1 else 'No heart disease detected'
    }

    return jsonify(response)


# Serve frontend static files when available
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))


@app.route('/', methods=['GET'])
def serve_index():
    # Serve the frontend index.html if present, otherwise return a simple message
    index_path = os.path.join(FRONTEND_DIR, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(FRONTEND_DIR, 'index.html')
    return jsonify({'status': 'backend running'})


@app.route('/static/<path:filename>')
def serve_static(filename):
    # Serve other frontend static files (css, js, etc.)
    return send_from_directory(FRONTEND_DIR, filename)

if __name__ == '__main__':
    # Bind to 0.0.0.0:5000 so the server is reachable from the host and Docker setups
    app.run(host='0.0.0.0', port=5000, debug=True)
