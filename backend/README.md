# Backend - AI Chatbot API

Express server with OpenAI integration for the AI Chatbot application.

## Features

- RESTful API endpoint for chat messages
- OpenAI GPT-3.5-turbo integration
- CORS enabled for frontend communication
- Comprehensive error handling
- Environment-based configuration

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in this directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

## Running

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### GET /
Health check endpoint

**Response:**
```json
{
  "message": "AI Chatbot API is running!"
}
```

### POST /chat
Send a message and get AI response

**Request Body:**
```json
{
  "message": "Your message here"
}
```

**Success Response:**
```json
{
  "response": "AI response here",
  "success": true
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `openai` - OpenAI API client

## Dev Dependencies

- `nodemon` - Auto-reload during development
