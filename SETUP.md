# Setup Instructions for Chatbot Web App

## Prerequisites
- Node.js (v18+ recommended)
- npm
- Python 3.10+
- MongoDB (local or Atlas)
- Git
- (Optional) CUDA-enabled GPU for AI model server

## Steps

### 1. Clone the Repository
```
git clone https://github.com/<your-username>/chatbot.git
cd chatbot
```

### 2. Frontend Setup
```
cd client
npm install
npm start
```

### 3. Backend Setup
```
cd ../server
npm install
npm start
```

### 4. Model Server Setup
```
cd ../model-server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 5. Database Setup
- Start MongoDB locally or set up a free cluster on MongoDB Atlas.
- Update connection string in backend `.env` file.

### 6. Environment Variables
- Create `.env` files in `server` and `model-server` folders for secrets and config.

### 7. Run the App
- Start all three services (frontend, backend, model server).
- Access the app at `http://localhost:3000`.

## Troubleshooting
- Ensure all dependencies are installed.
- Check `.env` files for correct configuration.
- For GPU acceleration, install CUDA and compatible PyTorch version.

## Contribution
- Fork the repo, create a branch, and submit a pull request.
