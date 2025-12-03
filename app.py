from flask import Flask, request, jsonify
from flask_cors import CORS
from auditor import run_audit 

# --- Configuration ---
app = Flask(__name__)
CORS(app) 

@app.route('/', methods=['GET'])
def root_status():
    return jsonify({
        "status": "online",
        "message": "Server is running! Send POST requests to /audit"
    }), 200

@app.route('/audit', methods=['POST'])
def handle_audit():
    
    try:
        data = request.get_json()
        
    
        if not data or 'url' not in data:
            return jsonify({'error': 'No URL provided'}), 400
        
        url_to_audit = data['url']

        
        if not url_to_audit.startswith(('http://', 'https://')):
             return jsonify({'error': 'URL must start with http:// or https://'}), 400

       
        results = run_audit(url_to_audit)
        
        
        return jsonify(results), 200

    except Exception as e:
       
        print(f"🔥 Error: {e}") 
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
