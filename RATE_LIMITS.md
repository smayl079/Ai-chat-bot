# Gemini API Rate Limits

## Current Configuration

Your chatbot is configured to work with **Gemini 2.5 Flash** API which has the following rate limits:

- **RPM (Requests Per Minute)**: 5 requests/minute
- **TPM (Tokens Per Minute)**: 250,000 tokens/minute

## How This Affects Your Chatbot

### Minimum Wait Time Between Messages
- **API Requirement**: 12 seconds (60 seconds ÷ 5 requests = 12 seconds)
- **Backend Implementation**: 13 seconds (with 1-second safety buffer)
- **Frontend Enforcement**: 15 seconds (with extra buffer for network delays)

### What We've Implemented

#### 1. **Backend Rate Limiting** ([chat-function.js](backend/chat-function.js))
```javascript
this.minRequestInterval = 13000; // 13 seconds
```
- Automatically waits between API calls
- Prevents hitting the 5 RPM limit
- Uses exponential backoff on rate limit errors (5s, 10s, 20s)

#### 2. **Frontend Cooldown Timer** ([ChatWindow.jsx](frontend/src/components/ChatWindow.jsx))
```javascript
const MIN_MESSAGE_INTERVAL = 15000; // 15 seconds
```
- Visual countdown timer on send button
- Shows remaining seconds before next message can be sent
- Prevents users from sending messages too quickly

#### 3. **User-Friendly Error Messages**
- Clear warnings when trying to send too quickly
- Informative error messages on rate limit hits
- Visual feedback with disabled send button

## Best Practices

### For Users
1. ✅ Wait at least 15 seconds between messages
2. ✅ Watch the countdown timer on the send button
3. ✅ Be patient - this prevents errors
4. ❌ Don't refresh the page repeatedly

### For Developers

#### To Upgrade to Higher Limits
If you need more requests per minute, consider:
- **Gemini 2.5 Pro**: Higher rate limits but slower
- **Paid Google AI Studio Plan**: Increased quota
- **Cloud-based deployment**: Better rate limit allocation

#### To Modify Rate Limits
1. **Backend** - Update `chat-function.js`:
   ```javascript
   this.minRequestInterval = YOUR_VALUE; // milliseconds
   ```

2. **Frontend** - Update `ChatWindow.jsx`:
   ```javascript
   const MIN_MESSAGE_INTERVAL = YOUR_VALUE; // milliseconds
   ```

**Formula**: `minInterval = (60 / requestsPerMinute) * 1000 + buffer`

Example for 10 RPM: `(60 / 10) * 1000 + 1000 = 7000ms`

## Troubleshooting

### Still Getting Rate Limit Errors?

1. **Check Your API Key Usage**
   - Multiple apps using same key will share the limit
   - Check [Google AI Studio](https://aistudio.google.com/) for usage

2. **Increase Wait Times**
   - Increase `MIN_MESSAGE_INTERVAL` in both backend and frontend
   - Try 20 seconds for extra safety

3. **Clear Session**
   - Close and reopen the chat window
   - This creates a new session ID

4. **Backend Logs**
   - Check terminal for rate limit warnings
   - Look for "Rate limiting: waiting Xs..." messages

### Error Messages Explained

- **"Please wait Xs before sending another message"**
  - Frontend blocking - wait for cooldown
  
- **"Rate limit exceeded. Waiting Xs before retry"**
  - Backend received 429 from API - automatic retry in progress

- **"Rate limit exceeded. The Gemini API has a limit of 5 requests per minute"**
  - Hit the hard API limit - wait at least 60 seconds

## Current Status

✅ **Rate Limiting Active**
- Backend: 13-second intervals
- Frontend: 15-second cooldown
- Visual countdown timer enabled
- Automatic retries on errors

## Additional Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Rate Limits Documentation](https://ai.google.dev/gemini-api/docs/quota)
- [Google AI Studio Console](https://aistudio.google.com/)
