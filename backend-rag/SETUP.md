# Setup Guide - RAG Chatbot Backend

Complete step-by-step guide to get the RAG chatbot backend running.

## Prerequisites Checklist

- [ ] Node.js 18 or higher installed
- [ ] PostgreSQL 14 or higher installed and running
- [ ] Database `chatbot_platform` created and seeded
- [ ] Gemini API key obtained
- [ ] Git installed (optional)

## Step-by-Step Setup

### Step 1: Install Node.js Dependencies

```bash
cd backend-rag
npm install
```

Expected output:
```
added 150 packages in 15s
```

### Step 2: Configure Environment Variables

Create `.env` file from template:

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Edit `.env` file with your actual credentials:

```env
PORT=3001
NODE_ENV=development

# Update with your PostgreSQL password
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/chatbot_platform"

# Add your Gemini API key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Models (recommended defaults)
GEMINI_CHAT_MODEL=gemini-1.5-flash
GEMINI_EMBEDDING_MODEL=text-embedding-004

# Retrieval settings
MAX_CHUNKS_TO_RETRIEVE=5
EMBEDDING_DIMENSION=768

# CORS (update for production)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=info
```

### Step 3: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the API key
4. Paste it in your `.env` file:
   ```env
   GEMINI_API_KEY=AIzaSyC...your_key_here
   ```

### Step 4: Verify Database Connection

The database should already be created and seeded from the `/database` folder.

Verify it's accessible:

```bash
# Test connection
psql -U postgres -d chatbot_platform -c "SELECT COUNT(*) FROM websites;"
```

Expected output:
```
 count 
-------
     3
(1 row)
```

If database doesn't exist, go back to `/database` folder and run setup:

```bash
cd ../database
psql -U postgres -c "CREATE DATABASE chatbot_platform;"
psql -U postgres -d chatbot_platform -f schema.sql
psql -U postgres -d chatbot_platform -f seed.sql
cd ../backend-rag
```

### Step 5: Generate Prisma Client

```bash
npm run prisma:generate
```

Expected output:
```
✔ Generated Prisma Client (v5.11.0)
```

### Step 6: Start the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Expected output:
```
[2026-03-11T10:00:00.000Z] [INFO] ✅ Database connected successfully
[2026-03-11T10:00:00.000Z] [INFO] ✅ Gemini AI configured
[2026-03-11T10:00:00.000Z] [INFO]    Chat Model: gemini-1.5-flash
[2026-03-11T10:00:00.000Z] [INFO]    Embedding Model: text-embedding-004
[2026-03-11T10:00:00.000Z] [INFO] 🚀 RAG Chatbot Server running on port 3001
[2026-03-11T10:00:00.000Z] [INFO] 📊 Environment: development
[2026-03-11T10:00:00.000Z] [INFO] 🔗 Health check: http://localhost:3001/health
[2026-03-11T10:00:00.000Z] [INFO] 💬 Chat API: http://localhost:3001/api/chat
```

### Step 7: Test the API

**Option A: Use the test script (recommended)**

```bash
npm test
```

This will run automated tests for all 3 websites.

**Option B: Manual curl test**

Open a new terminal and test:

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"websiteId\": 1, \"message\": \"What services do you offer?\"}"
```

**Option C: Use Postman or similar tool**

1. Create POST request to `http://localhost:3001/api/chat`
2. Set header: `Content-Type: application/json`
3. Set body:
   ```json
   {
     "websiteId": 1,
     "message": "What services do you offer?"
   }
   ```
4. Send request

Expected response:
```json
{
  "success": true,
  "answer": "We offer comprehensive dental services including...",
  "sources": ["service", "page"],
  "metadata": {
    "websiteId": 1,
    "websiteName": "SmileCare Dental Clinic",
    "chunksRetrieved": 5,
    "processingTimeMs": 1234
  }
}
```

## Troubleshooting

### Issue 1: Database Connection Failed

**Error:**
```
❌ Database connection failed: connect ECONNREFUSED
```

**Solutions:**

1. Check PostgreSQL is running:
   ```bash
   # Windows
   sc query postgresql-x64-14
   
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verify DATABASE_URL in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/chatbot_platform"
   ```

3. Test connection manually:
   ```bash
   psql -U postgres -h localhost -d chatbot_platform
   ```

### Issue 2: Gemini API Error

**Error:**
```
Failed to generate embedding
API_KEY_INVALID
```

**Solutions:**

1. Check API key is set in `.env`:
   ```bash
   # Windows
   type .env | findstr GEMINI_API_KEY
   
   # Mac/Linux
   grep GEMINI_API_KEY .env
   ```

2. Verify API key is valid:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Check if key is active
   - Generate new key if needed

3. Ensure no extra spaces in `.env`:
   ```env
   GEMINI_API_KEY=AIza...key_here
   # NOT: GEMINI_API_KEY= AIza...key_here (space before key)
   ```

### Issue 3: Prisma Client Not Found

**Error:**
```
Cannot find module '@prisma/client'
```

**Solution:**
```bash
npm run prisma:generate
```

If error persists:
```bash
rm -rf node_modules
npm install
npm run prisma:generate
```

### Issue 4: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**

1. Change port in `.env`:
   ```env
   PORT=3002
   ```

2. Or kill process using port 3001:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3001 | xargs kill -9
   ```

### Issue 5: No Chunks Retrieved

**Error:**
```
{
  "chunksRetrieved": 0
}
```

**Solutions:**

1. Check if database has data:
   ```bash
   psql -U postgres -d chatbot_platform -c "SELECT COUNT(*) FROM chatbot_chunks;"
   ```
   
   Should return 90 (30 per website).

2. If empty, reseed database:
   ```bash
   cd ../database
   psql -U postgres -d chatbot_platform -f seed.sql
   cd ../backend-rag
   ```

3. Restart server:
   ```bash
   npm run dev
   ```

### Issue 6: CORS Error (from frontend)

**Error:**
```
Access to fetch at 'http://localhost:3001/api/chat' has been blocked by CORS policy
```

**Solution:**

Add your frontend URL to ALLOWED_ORIGINS in `.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8080
```

Restart server.

## Verification Checklist

After setup, verify everything works:

- [ ] Server starts without errors
- [ ] Health check responds: `curl http://localhost:3001/health`
- [ ] Websites list loads: `curl http://localhost:3001/api/websites`
- [ ] Chat API works: Test with sample question
- [ ] Database queries execute (check logs)
- [ ] Gemini API responds (check logs)
- [ ] No error messages in console

## Next Steps

1. ✅ Backend is running
2. ⬜ Test all API endpoints
3. ⬜ Connect frontend to backend
4. ⬜ Test multi-tenant isolation
5. ⬜ Deploy to production (optional)

## Development Tips

### Watch Logs

See detailed logs with debug level:

```env
LOG_LEVEL=debug
```

### View Database

Use Prisma Studio to browse database:

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

### Test Specific Website

Test each website separately:

```bash
# SmileCare Dental (ID: 1)
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 1, "message": "What services do you offer?"}'

# TechForge Solutions (ID: 2)
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 2, "message": "What technologies do you use?"}'

# LearnHub Academy (ID: 3)
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"websiteId": 3, "message": "How much is a subscription?"}'
```

### Monitor Performance

Check processing times in response:

```json
{
  "metadata": {
    "processingTimeMs": 1234
  }
}
```

Typical times:
- Fast: < 1000ms
- Normal: 1000-2000ms
- Slow: > 2000ms (check logs)

## Production Deployment

For production deployment, see [README.md](./README.md#production-deployment).

Key differences:
- Set `NODE_ENV=production`
- Use process manager (PM2)
- Enable HTTPS
- Configure proper CORS
- Use environment-specific Gemini models
- Set up monitoring

## Getting Help

If you're still having issues:

1. Check logs: Set `LOG_LEVEL=debug` in `.env`
2. Review error messages carefully
3. Verify all prerequisites are met
4. Test database connection separately
5. Test Gemini API separately

## Useful Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test

# View database
npm run prisma:studio

# Check health
curl http://localhost:3001/health

# List websites
curl http://localhost:3001/api/websites
```

---

**Setup Complete! 🎉**

Your RAG chatbot backend is now ready to answer questions based on your website data.
