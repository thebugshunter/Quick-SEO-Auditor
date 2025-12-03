from flask import Flask, request, jsonify
from flask_cors import CORS
from auditor import run_audit  # Your Python logic lives here

# --- Configuration ---
app = Flask(__name__)
# Crucial for allowing requests from your separate GitHub Pages frontend
CORS(app) 

@app.route('/audit', methods=['POST'])
def handle_audit():
    # 1. Receive data from the Front-End (must be JSON)
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'No URL provided'}), 400
    
    url_to_audit = data['url']

    # 2. Execute your core Python QA function
    results = run_audit(url_to_audit)
    
    # 3. Return the Python dictionary as JSON to the Front-End
    # jsonify handles converting the Python dict to JSON string
    return jsonify(results)

if __name__ == '__main__':
    # Flask runs on port 5000 by default for local testing
    app.run(debug=True, port=5000)
