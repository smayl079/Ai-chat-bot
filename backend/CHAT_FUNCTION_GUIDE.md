# Chat Function with Conversation History

This module provides a chat function that uses Google's Gemini API with conversation history management.

## Features

- ✅ **Conversation History**: Maintains context across multiple messages
- ✅ **Memory Management**: Tracks user and assistant messages
- ✅ **Gemini Integration**: Uses Google's Gemini 2.0 Flash model
- ✅ **Session Management**: Support for multiple concurrent chat sessions
- ✅ **Easy to Use**: Clean API for sending messages and managing history

## Installation

The required dependencies are already in `package.json`:

```bash
npm install
```

## Setup

1. Ensure you have a `.env` file in the backend directory with your Google API key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

## Usage

### Standalone Usage

```javascript
import { ChatSession } from './chat-function.js';

// Create a new chat session
const chatSession = new ChatSession();

// Send first message
const answer1 = await chatSession.sendMessage('What is the capital of France?');
console.log(answer1); // "Paris is the capital of France..."

// Send follow-up message (uses conversation history)
const answer2 = await chatSession.sendMessage('What is its population?');
console.log(answer2); // "Paris has a population of approximately..."
```

### API Endpoint Usage

The server provides endpoints for chat with history:

#### POST `/chat-session`
Send a message with conversation history:

```bash
curl -X POST http://localhost:5000/chat-session \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is JavaScript?",
    "sessionId": "user123"
  }'
```

Response:
```json
{
  "response": "JavaScript is a programming language...",
  "success": true,
  "historyLength": 2
}
```

#### GET `/chat-session/:sessionId/history`
Get conversation history:

```bash
curl http://localhost:5000/chat-session/user123/history
```

#### DELETE `/chat-session/:sessionId`
Clear conversation history:

```bash
curl -X DELETE http://localhost:5000/chat-session/user123
```

## Running Examples

### Example 1: Run the built-in example
```bash
node chat-function.js
```

This will:
1. Ask "What is the capital of France?"
2. Ask "What is its population?" (follow-up using context)
3. Display the full conversation history

### Example 2: Run the test file
```bash
node test-chat-function.js
```

This demonstrates a two-question conversation about JavaScript.

## ChatSession Class API

### Constructor
```javascript
new ChatSession(modelName = "gemini-2.0-flash-exp")
```

### Methods

#### `sendMessage(userMessage)`
- **Parameters**: `userMessage` (string) - The user's question or message
- **Returns**: Promise<string> - The assistant's reply
- **Description**: Sends a message and maintains conversation history

#### `getHistory()`
- **Returns**: Array - Array of conversation messages in Gemini format
- **Description**: Returns the raw conversation history

#### `getFormattedHistory()`
- **Returns**: string - Formatted conversation string
- **Description**: Returns a human-readable version of the conversation

#### `clearHistory()`
- **Description**: Clears the conversation history and resets the chat session

## How It Works

1. **Initialization**: Creates a ChatSession instance with Gemini model
2. **First Message**: User sends a question → Gemini responds → Both stored in history
3. **Follow-up Messages**: User sends another question → Gemini uses previous context → New messages added to history
4. **Context Awareness**: Gemini can reference previous messages, making conversations natural

## Message History Format

Each message in history follows this structure:

```javascript
{
  role: 'user' | 'model',
  parts: [{ text: 'message content' }]
}
```

## Configuration

The chat session can be configured in the constructor:

```javascript
const chatSession = new ChatSession('gemini-2.0-flash-exp');
```

Available models:
- `gemini-2.0-flash-exp` (default, fastest)
- `gemini-1.5-flash`
- `gemini-1.5-pro`

## Error Handling

The function handles common errors:
- Invalid API key
- Network errors
- Rate limiting
- Model unavailability

```javascript
try {
  const response = await chatSession.sendMessage('Hello');
  console.log(response);
} catch (error) {
  console.error('Error:', error.message);
}
```

## Best Practices

1. **Session Management**: Use unique sessionIds for different users
2. **History Cleanup**: Clear history periodically to avoid token limits
3. **Error Handling**: Always wrap API calls in try-catch blocks
4. **Rate Limiting**: Be aware of Google API rate limits

## Testing

Run the test suite:

```bash
# Test the chat function
node test-chat-function.js

# Test with custom questions
node chat-function.js
```

## Troubleshooting

### "Google API key is not configured"
- Ensure `.env` file exists with `GOOGLE_API_KEY=your_key`
- Check that dotenv is loaded properly

### "Rate limit exceeded"
- Wait a few moments before retrying
- Consider upgrading your Google API plan

### Context not maintained
- Verify you're using the same ChatSession instance
- Check that history is not being cleared inadvertently

## Example Output

```
=============================================================
Chat Function with Conversation History - Example Usage
=============================================================

Question 1: "What is the capital of France?"
------------------------------------------------------------
Assistant: Paris is the capital of France. It's a major European city known for its art, fashion, gastronomy, and culture.

Question 2: "What is its population?"
------------------------------------------------------------
Assistant: The population of Paris proper is around 2.1 million people, but the greater Paris metropolitan area has over 12 million inhabitants.

=============================================================
Full Conversation History:
=============================================================
1. User: What is the capital of France?

2. Assistant: Paris is the capital of France...

3. User: What is its population?

4. Assistant: The population of Paris proper is around 2.1 million...
```

## Integration with Frontend

To use this in your frontend, send requests to `/chat-session`:

```javascript
const response = await fetch('http://localhost:5000/chat-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Hello!',
    sessionId: 'user123'
  })
});

const data = await response.json();
console.log(data.response);
```

## License

ISC
