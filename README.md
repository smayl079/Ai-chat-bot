# AI Chatbot Web Application 🤖

A modern, full-stack AI chatbot application built with React, Node.js, Express, and OpenAI API.

![Modern UI](https://img.shields.io/badge/UI-Modern%20%26%20Clean-blue)
![Full Stack](https://img.shields.io/badge/Stack-Full--Stack-green)
![AI Powered](https://img.shields.io/badge/AI-OpenAI-orange)

## ✨ Features

- 🎨 **Modern UI/UX**: Clean, minimal white design with floating chatbot button
- 💬 **Real-time Chat**: Instant messaging with AI assistant
- 🚀 **Fast & Responsive**: Built with Vite and React
- 🔒 **Secure**: API keys stored in environment variables
- 📱 **Mobile Friendly**: Responsive design for all devices
- ⚡ **Smooth Animations**: Polished user experience with CSS animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool for fast development
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **OpenAI API** - GPT-3.5-turbo for AI responses
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
ai-chat-bot/
├── backend/
│   ├── server.js          # Express server with OpenAI integration
│   ├── package.json       # Backend dependencies
│   ├── .env.example       # Environment variable template
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatButton.jsx    # Floating chat button
│   │   │   ├── ChatButton.css
│   │   │   ├── ChatWindow.jsx    # Chat interface
│   │   │   └── ChatWindow.css
│   │   ├── App.jsx        # Main app component
│   │   ├── App.css
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json       # Frontend dependencies
│   ├── .env.example       # Environment variable template
│   └── .gitignore
│
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

#### 1. Clone or navigate to the project
```bash
cd "c:\Users\User\OneDrive\Desktop\ai chat bot"
```

#### 2. Set up Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file from template
copy .env.example .env

# Edit .env file and add your OpenAI API key
# OPENAI_API_KEY=your_api_key_here
# PORT=5000
```

#### 3. Set up Frontend

```bash
# Navigate to frontend folder (from project root)
cd ../frontend

# Install dependencies
npm install

# Create .env file from template
copy .env.example .env

# The default settings should work:
# VITE_API_URL=http://localhost:5000
```

### Running the Application

#### Terminal 1 - Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
🚀 Server is running on http://localhost:5000
📡 Chat endpoint: POST http://localhost:5000/chat
```

#### Terminal 2 - Start Frontend Development Server

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

#### 4. Open your browser

Navigate to `http://localhost:3000`

You should see a clean white page with a floating chatbot button in the bottom-right corner!

## 🎯 Usage

1. Click the **floating chat button** in the bottom-right corner
2. The chat window will open above the button
3. Type your message in the input field
4. Press **Enter** or click the **send button**
5. Wait for the AI response (you'll see a typing indicator)
6. Click the **X button** or the chat button again to close

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` folder:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
PORT=5000
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000
```

## 📝 API Documentation

### POST /chat

Send a message to the AI assistant.

**Request:**
```json
{
  "message": "Hello, how are you?"
}
```

**Response (Success):**
```json
{
  "response": "I'm doing well, thank you! How can I assist you today?",
  "success": true
}
```

**Response (Error):**
```json
{
  "error": "Error message here"
}
```

## 🎨 Customization

### Change AI Model

Edit `backend/server.js`:
```javascript
model: "gpt-4", // Change from gpt-3.5-turbo to gpt-4
```

### Modify Colors

Edit `frontend/src/components/ChatButton.css` and `ChatWindow.css` to change the gradient colors:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adjust Chat Window Size

Edit `frontend/src/components/ChatWindow.css`:
```css
.chat-window {
  width: 380px;  /* Change width */
  height: 550px; /* Change height */
}
```

## 🐛 Troubleshooting

### Backend errors

- **"OpenAI API key is not configured"**: Make sure you created `.env` file in backend folder
- **Port already in use**: Change PORT in backend `.env` file
- **401 Unauthorized**: Check if your OpenAI API key is valid

### Frontend errors

- **Cannot connect to server**: Make sure backend is running on port 5000
- **CORS errors**: Backend has CORS enabled, but check if the API_URL is correct

## 📦 Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The production files will be in `frontend/dist/`

### Backend

The backend is production-ready. Make sure to:
1. Set proper environment variables
2. Use a process manager like PM2
3. Set up a reverse proxy (nginx)

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

## 📄 License

ISC

## 👨‍💻 Author

Senior Full-Stack Developer & UI/UX Designer

---

**Enjoy your AI chatbot! 🎉**

For questions or issues, please check the troubleshooting section above.
