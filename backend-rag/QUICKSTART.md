# 🚀 Quick Start - 5 Minutes to Running Chatbot

Get your RAG chatbot running in 5 minutes!

## Prerequisites (2 minutes)

1. ✅ PostgreSQL running
2. ✅ Database `chatbot_platform` seeded (from `/database` folder)
3. ✅ [Gemini API key](https://makersuite.google.com/app/apikey)

## Setup (3 minutes)

### 1. Install Dependencies (1 min)

```bash
cd backend-rag
npm install
```

### 2. Configure Environment (1 min)

Create `.env` file:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Edit `.env` - Update these 2 lines:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/chatbot_platform"
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

### 3. Generate Prisma Client (30 sec)

```bash
npm run prisma:generate
```

### 4. Start Server (30 sec)

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
✅ Gemini AI configured
🚀 RAG Chatbot Server running on port 3001
```

## Test It! (1 minute)

### Option 1: Quick Test

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": "What services do you offer?"}'
```

### Option 2: Run Full Test Suite

```bash
npm test
```

This tests all 3 websites with 15 different questions.

### Option 3: Manual Test

Open browser to:
- Health check: http://localhost:3001/health
- List websites: http://localhost:3001/api/websites

Use Postman/Insomnia to POST to `http://localhost:3001/api/chat`:
```json
{
  "websiteId": 1,
  "message": "How much does teeth whitening cost?"
}
```

## Expected Response

```json
{
  "success": true,
  "answer": "Professional teeth whitening at SmileCare costs $499...",
  "sources": ["service", "page"],
  "metadata": {
    "websiteId": 1,
    "websiteName": "SmileCare Dental Clinic",
    "chunksRetrieved": 5,
    "processingTimeMs": 1234
  }
}
```

## Test All 3 Websites

### 1. SmileCare Dental (Healthcare)
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": "What are your working hours?"}'
```

### 2. TechForge Solutions (Software Agency)
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 2, "message": "What technologies do you use?"}'
```

### 3. LearnHub Academy (Education)
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 3, "message": "Is there a free trial?"}'
```

## Troubleshooting

### ❌ Database connection failed
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Verify database exists
psql -U postgres -c "\l chatbot_platform"
```

### ❌ Gemini API error
- Check API key is correct in `.env`
- Verify at: https://makersuite.google.com/app/apikey

### ❌ Prisma client not found
```bash
npm run prisma:generate
```

### ❌ Port 3001 already in use
Change `PORT=3002` in `.env`

## What's Next?

✅ **Backend is running!**

Now you can:
1. 📖 Read [README.md](./README.md) for full documentation
2. 🧪 Try [API-EXAMPLES.md](./API-EXAMPLES.md) for more test queries
3. 🎨 Connect your frontend (React/Vue/etc)
4. 🚀 Deploy to production

## How It Works

```
User Question → Website ID → Retrieve Relevant Chunks → 
Build Context → Send to Gemini AI → Return Answer
```

All data is isolated by `website_id` - each website only sees its own data!

## Key Features

- ✅ Multi-tenant (3 websites included)
- ✅ RAG-based (answers from database)
- ✅ Gemini AI powered
- ✅ Keyword search (no vector DB needed)
- ✅ Production-ready code
- ✅ Error handling
- ✅ Logging

## Quick Commands

```bash
npm run dev         # Start development server
npm start           # Start production server
npm test            # Run test suite
npm run prisma:studio  # View database in browser
```

## Need Help?

1. See [SETUP.md](./SETUP.md) for detailed setup
2. Check [README.md](./README.md) for full docs
3. View logs: Set `LOG_LEVEL=debug` in `.env`

---

**🎉 Congratulations!**

Your RAG chatbot backend is ready. Each website can now have intelligent conversations based on its own data!
