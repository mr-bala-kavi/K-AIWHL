from flask import Flask, request, jsonify
import pickle
import yaml
import os

app = Flask(__name__)

UPLOAD_FOLDER = '/tmp/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "upload-service"})

@app.route('/upload', methods=['POST'])
def upload_file():
    """
    VULNERABILITY 8: Remote Code Execution via Insecure Deserialization
    Flag: flag{KAI_RCE_upl04d_pwn4g3}
    
    This endpoint accepts file uploads and unsafely deserializes them.
    
    Exploit methods:
    1. Upload a malicious pickle file that executes code during deserialization
    2. Upload YAML with !!python/object tags
    
    Example pickle exploit:
    ```python
    import pickle
    import base64
    import os
    
    class Exploit:
        def __reduce__(self):
            return (os.system, ('echo flag{KAI_RCE_upl04d_pwn4g3} > /tmp/flag.txt',))
    
    payload = pickle.dumps(Exploit())
    ```
    """
    
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    file_type = request.form.get('type', 'pickle')
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    try:
        file_content = file.read()
        
        if file_type == 'pickle':
            # VULNERABLE: Unsafe deserialization of pickle files
            # This allows arbitrary code execution
            data = pickle.loads(file_content)
            return jsonify({
                "message": "Pickle file processed",
                "data": str(data),
                "flag": "flag{KAI_RCE_upl04d_pwn4g3}",
                "warning": "Pickle deserialization executed!"
            })
        
        elif file_type == 'yaml':
            # VULNERABLE: Using unsafe YAML loader
            # Allows execution of Python objects
            data = yaml.load(file_content, Loader=yaml.UnsafeLoader)
            return jsonify({
                "message": "YAML file processed",
                "data": data,
                "flag": "flag{KAI_RCE_upl04d_pwn4g3}",
                "warning": "Unsafe YAML deserialization executed!"
            })
        
        elif file_type == 'config':
            # VULNERABLE: Using eval() on uploaded content
            config_str = file_content.decode('utf-8')
            if 'flag' in config_str:
                # Direct eval (extremely dangerous)
                result = eval(config_str)
                return jsonify({
                    "message": "Config evaluated",
                    "result": result,
                    "flag": "flag{KAI_RCE_upl04d_pwn4g3}"
                })
            return jsonify({"message": "Config processed"})
        
        else:
            return jsonify({"error": "Unsupported file type"}), 400
    
    except Exception as e:
        return jsonify({
            "error": str(e),
            "flag": "flag{KAI_RCE_upl04d_pwn4g3}",
            "hint": "Exception occurred during unsafe deserialization"
        }), 500

@app.route('/list-uploads', methods=['GET'])
def list_uploads():
    """List uploaded files"""
    try:
        files = os.listdir(UPLOAD_FOLDER)
        return jsonify({"files": files})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
