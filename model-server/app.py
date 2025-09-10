
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import vertexai
from vertexai.preview.generative_models import GenerativeModel, ChatSession


# Set Google credentials and project
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"F:\iisc\sem 3\cloud computing\chatbot\model-server\cahtbot-471607-78e7fa747384.json"
PROJECT_ID = "cahtbot-471607"
LOCATION = "us-central1"

app = Flask(__name__)
CORS(app)

# Initialize Vertex AI and Gemini model
vertexai.init(project=PROJECT_ID, location=LOCATION)
model = GenerativeModel("gemini-2.5-flash")

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    try:
        chat_session = model.start_chat()
        response = chat_session.send_message(user_message)
        return jsonify({'response': response.text})
    except Exception as e:
        print('Error in /chat:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/')
def health():
    return 'Model server is running.'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


