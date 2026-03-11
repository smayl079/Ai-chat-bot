# RAG-Based Multi-Tenant Chatbot Backend

Production-ready Node.js backend for a multi-tenant RAG chatbot system using PostgreSQL, Prisma, and Gemini AI.

## 🎯 Features

- ✅ **Multi-tenant architecture** - Each website has isolated data
- ✅ **RAG (Retrieval-Augmented Generation)** - Answers based on database content
- ✅ **Gemini AI integration** - Using Google's Gemini API
- ✅ **PostgreSQL + Prisma** - Type-safe database access
- ✅ **Keyword-based retrieval** - Works without vector embeddings
- ✅ **Modular architecture** - Clean, maintainable code structure
- ✅ **Error handling** - Comprehensive error management
- ✅ **Logging** - Detailed logging for debugging
- ✅ **Express.js API** - RESTful endpoints

## 📁 Project Structure

```
backend-rag/
├── src/
│   ├── server.js                 # Main server entry point
│   ├── config/
│   │   ├── database.js           # Prisma client configuration
│   │   └── gemini.js             # Gemini AI configuration
│   ├── routes/
│   │   └── chat.routes.js        # API route definitions
│   ├── controllers/
│   │   └── chat.controller.js    # Request handlers
│   ├── services/
│   │   ├── database.service.js   # Database queries
│   │   ├── embedding.service.js  # Gemini embeddings
│   │   ├── retrieval.service.js  # RAG retrieval logic
│   │   └── chat.service.js       # Main chat orchestration
│   ├── middleware/
│   │   ├── validation.middleware.js  # Request validation
│   │   └── error.middleware.js       # Error handling
│   ├── utils/
│   │   ├── logger.js             # Logging utility
│   │   └── errors.js             # Custom error classes
│   └── test/
│       └── test-chat.js          # API test script
├── prisma/
│   └── schema.prisma             # Database schema
├── package.json
├── .env.example
└── README.md
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ running
- Database created and seeded (from `/database` folder)
- Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

### 2. Installation

```bash
# Navigate to backend directory
cd backend-rag

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate
```

### 3. Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=3001
NODE_ENV=development

# PostgreSQL connection
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/chatbot_platform"

# Gemini API key
GEMINI_API_KEY=your_actual_api_key_here

# Models
GEMINI_CHAT_MODEL=gemini-1.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004

# Retrieval settings
MAX_CHUNKS_TO_RETRIEVE=5
EMBEDDING_DIMENSION=768
```

### 4. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:3001`

### 5. Test the API

```bash
# Run test suite
npm test
```

Or test manually with curl:

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "websiteId": 1,
    "message": "What services do you offer?"
  }'
```

## 📡 API Endpoints

### POST /api/chat

Main chatbot endpoint - processes user message and returns AI response.

**Request:**
```json
{
  "websiteId": 1,
  "message": "What services do you offer?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "We offer comprehensive dental services including routine checkups, professional cleanings, teeth whitening, dental crowns, Invisalign clear aligners, root canal therapy, and dental implants. Our services cover general dentistry, cosmetic dentistry, orthodontics, and emergency dental care.",
  "sources": ["service", "page"],
  "metadata": {
    "websiteId": 1,
    "websiteName": "SmileCare Dental Clinic",
    "chunksRetrieved": 5,
    "processingTimeMs": 1234
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Website with ID 999 not found or inactive",
  "code": "WEBSITE_NOT_FOUND"
}
```

### GET /api/websites

Get list of all active websites.

**Response:**
```json
{
  "success": true,
  "count": 3,
  "websites": [
    {
      "id": 1,
      "name": "SmileCare Dental Clinic",
      "domain": "smilecare-dental.com",
      "businessType": "Healthcare - Dentistry",
      "chatbotName": "Dental Assistant"
    },
    // ...
  ]
}
```

### GET /api/website/:id

Get specific website details.

**Response:**
```json
{
  "success": true,
  "website": {
    "id": 1,
    "name": "SmileCare Dental Clinic",
    "domain": "smilecare-dental.com",
    "businessType": "Healthcare - Dentistry",
    "chatbotName": "Dental Assistant",
    "language": "en"
  }
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-03-11T12:00:00.000Z",
  "uptime": 123.456
}
```

## 🧠 How RAG Works

The system uses Retrieval-Augmented Generation (RAG) to answer questions:

```
1. User Question
      ↓
2. Validate Website (multi-tenant isolation)
      ↓
3. Retrieve Relevant Chunks (keyword-based search)
      ↓
4. Fetch Additional Context (FAQs, services, contact info)
      ↓
5. Build Context Prompt
      ↓
6. Send to Gemini AI (with system prompt + context + question)
      ↓
7. Return AI Response
```

### Retrieval Strategy

Currently uses **keyword-based retrieval** (no vector embeddings required):

1. Extract keywords from user question
2. Search chunks in database using PostgreSQL `ILIKE`
3. Rank results by keyword relevance
4. Return top 5 most relevant chunks

### Context Building

The system gathers context from multiple sources:

- **Chatbot Chunks** - Pre-chunked text from documents
- **FAQ Items** - Direct Q&A pairs
- **Services** - Service descriptions and pricing
- **Contact Info** - Business contact details

All filtered by `website_id` for multi-tenant isolation.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3001 |
| NODE_ENV | Environment (development/production) | development |
| DATABASE_URL | PostgreSQL connection string | Required |
| GEMINI_API_KEY | Google Gemini API key | Required |
| GEMINI_CHAT_MODEL | Model for chat responses | gemini-1.5-flash |
| GEMINI_EMBEDDING_MODEL | Model for embeddings | text-embedding-004 |
| MAX_CHUNKS_TO_RETRIEVE | Number of chunks to retrieve | 5 |
| ALLOWED_ORIGINS | CORS allowed origins | * |
| LOG_LEVEL | Logging level (debug/info/warn/error) | info |

### Gemini Models

**Chat Models:**
- `gemini-1.5-flash` - Fast, good for most use cases (recommended)
- `gemini-1.5-pro` - More capable, slower, more expensive

**Embedding Models:**
- `text-embedding-004` - Latest embedding model
- `embedding-001` - Legacy model

## 🔍 Testing

### Test Script

Run the included test script to test all websites:

```bash
npm test
```

This will:
1. Test all 3 sample websites
2. Ask 5 questions per website
3. Display responses with metadata

### Manual Testing

**Test SmileCare Dental (Website ID: 1):**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": "How much does teeth whitening cost?"}'
```

**Test TechForge Solutions (Website ID: 2):**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 2, "message": "What technologies do you use?"}'
```

**Test LearnHub Academy (Website ID: 3):**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 3, "message": "Is there a free trial?"}'
```

### Sample Questions

**SmileCare Dental:**
- "What services do you offer?"
- "How much does teeth whitening cost?"
- "What are your working hours?"
- "Do you accept insurance?"
- "Tell me about your dentists"

**TechForge Solutions:**
- "What technologies do you use?"
- "How much does web development cost?"
- "What is your development process?"
- "Do you provide support after launch?"

**LearnHub Academy:**
- "What courses do you offer?"
- "How much is a subscription?"
- "Do you offer certificates?"
- "Is there a free trial?"

## 🐛 Debugging

### Enable Debug Logging

Set `LOG_LEVEL=debug` in `.env`:

```env
LOG_LEVEL=debug
```

This will show:
- Database queries
- Retrieved chunks
- Built prompts
- API calls

### Common Issues

**1. Database Connection Failed**
```
❌ Database connection failed: connect ECONNREFUSED
```

**Solution:** Check PostgreSQL is running:
```bash
# Windows
sc query postgresql

# Mac/Linux
brew services list
```

**2. Gemini API Error**
```
Failed to generate embedding
```

**Solution:** Verify API key is correct in `.env`

**3. No Chunks Retrieved**
```
chunksRetrieved: 0
```

**Solution:** Check database has seed data:
```bash
psql -U postgres -d chatbot_platform -c "SELECT COUNT(*) FROM chatbot_chunks;"
```

**4. Prisma Client Not Generated**
```
Cannot find module '@prisma/client'
```

**Solution:**
```bash
npm run prisma:generate
```

## 📊 Performance

### Response Times

Typical response times (on localhost):

- Keyword retrieval: 20-50ms
- Gemini API call: 500-2000ms
- Total processing: 600-2500ms

### Optimization Tips

1. **Cache website data** - Website info rarely changes
2. **Use connection pooling** - Prisma handles this automatically
3. **Limit chunk count** - Adjust `MAX_CHUNKS_TO_RETRIEVE`
4. **Use faster Gemini model** - `gemini-1.5-flash` vs `gemini-1.5-pro`

## 🚀 Production Deployment

### Environment Setup

```env
NODE_ENV=production
PORT=3001
LOG_LEVEL=warn

# Use connection pooling
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10"

# Production Gemini settings
GEMINI_CHAT_MODEL=gemini-1.5-flash
```

### Security Recommendations

1. ✅ Set specific CORS origins
2. ✅ Use environment variables (never commit secrets)
3. ✅ Enable rate limiting (add middleware)
4. ✅ Use HTTPS in production
5. ✅ Validate all inputs
6. ✅ Log errors but not sensitive data

### Process Management

Use PM2 for production:

```bash
npm install -g pm2

# Start server
pm2 start src/server.js --name chatbot-api

# Monitor
pm2 logs chatbot-api

# Restart
pm2 restart chatbot-api
```

## 🔮 Future Enhancements

### Vector Embeddings with pgvector

To enable semantic search with embeddings:

1. **Install pgvector extension:**
```sql
CREATE EXTENSION vector;
```

2. **Add embedding column:**
```sql
ALTER TABLE chatbot_chunks 
ADD COLUMN embedding vector(768);
```

3. **Generate embeddings:**
```javascript
// Use embedding.service.js to generate embeddings
const embedding = await embeddingService.generateEmbedding(chunkText);

// Store in database
await prisma.chatbotChunk.update({
  where: { id: chunk.id },
  data: { embedding }
});
```

4. **Update retrieval service** to use cosine similarity search

See [VECTOR-SETUP.md](./VECTOR-SETUP.md) for detailed instructions.

### Other Improvements

- [ ] Conversation history tracking
- [ ] User session management
- [ ] Rate limiting middleware
- [ ] Caching layer (Redis)
- [ ] Analytics and monitoring
- [ ] Multi-language support
- [ ] Streaming responses
- [ ] Admin dashboard

## 📚 Related Documentation

- [Database Setup Guide](../database/README.md)
- [Schema Reference](../database/SCHEMA-REFERENCE.md)
- [Frontend Integration](../frontend/README.md)

## 🤝 Support

For issues or questions:
1. Check logs: `LOG_LEVEL=debug npm run dev`
2. Verify database connection
3. Test with sample requests
4. Check Gemini API status

## 📝 License

MIT License - See LICENSE file for details
