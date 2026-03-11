# Multi-Tenant Chatbot Platform Database

Complete PostgreSQL database schema with seed data for a multi-tenant website-based chatbot platform.

## Overview

This database supports a RAG-based (Retrieval-Augmented Generation) chatbot system where multiple websites can each have their own isolated chatbot that answers questions based only on that website's content.

## Database Structure

### Core Tables

#### 1. **websites** (Tenant Master Table)
The main table for multi-tenancy. Each website is a separate tenant with isolated data.

**Key Fields:**
- `domain` - Unique identifier for tenant lookup
- `system_prompt` - Custom AI instructions per website
- `chatbot_name` - Customizable chatbot name
- `is_active` - Enable/disable chatbots

#### 2. **pages**
Website content pages (About, Services, etc.)
- Used to generate contextual information for the chatbot
- Each page has rich content about the business

#### 3. **faq_items**
Frequently asked questions with answers
- Pre-written Q&A pairs
- Categorized for easy filtering
- Perfect for direct answer matching

#### 4. **services**
Business services or products
- Detailed descriptions
- Pricing information
- Active/inactive status

#### 5. **contact_info**
Contact details per website
- Single record per website (1:1 relationship)
- Email, phone, address, working hours

#### 6. **chatbot_documents**
Source documents for RAG system
- Aggregated content from pages, FAQs, services
- Can include custom documents
- `source_type` field tracks origin

#### 7. **chatbot_chunks**
Text chunks for vector embeddings
- Documents split into smaller chunks
- Ready for embedding generation
- Used for semantic search in RAG

## Multi-Tenancy Implementation

### Data Isolation
Every table (except `websites`) includes `website_id` foreign key with indexes for fast filtering.

**Always filter by website_id:**
```sql
-- ✅ CORRECT: Tenant-isolated query
SELECT * FROM pages WHERE website_id = 1;

-- ❌ WRONG: Cross-tenant query (security risk)
SELECT * FROM pages WHERE slug = 'about';
```

### Tenant Identification
Identify tenant by domain in your application:
```javascript
// Example in Node.js
const domain = req.headers.host; // e.g., 'smilecare-dental.com'
const website = await prisma.website.findUnique({
  where: { domain: domain }
});
const websiteId = website.id;

// Now use websiteId for all queries
const pages = await prisma.page.findMany({
  where: { websiteId: websiteId }
});
```

## Sample Data

The database includes realistic seed data for **3 different businesses**:

### 1. SmileCare Dental Clinic
**Domain:** `smilecare-dental.com`
**Industry:** Healthcare - Dentistry
**Content:**
- 5 pages (Home, Services, Team, Insurance, Resources)
- 8 FAQ items about dental services
- 6 services (Checkup, Whitening, Crowns, Invisalign, Root Canal, Implants)
- 10 documents and 30 chunks for RAG

### 2. TechForge Solutions
**Domain:** `techforge-solutions.io`
**Industry:** Software Development Agency
**Content:**
- 5 pages (Home, Services, Process, Case Studies, Careers)
- 8 FAQ items about development services
- 6 services (Web Dev, Mobile Dev, Cloud, APIs, Design, Consulting)
- 10 documents and 30 chunks for RAG

### 3. LearnHub Academy
**Domain:** `learnhub-academy.edu`
**Industry:** Online Education Platform
**Content:**
- 5 pages (Home, Courses, Pricing, How It Works, Testimonials)
- 8 FAQ items about courses and pricing
- 6 services (course offerings)
- 10 documents and 30 chunks for RAG

## Installation & Setup

### 1. Create PostgreSQL Database

```bash
# Using psql
createdb chatbot_platform

# Or via SQL
CREATE DATABASE chatbot_platform;
```

### 2. Run Schema

```bash
psql -U your_username -d chatbot_platform -f database/schema.sql
```

### 3. Load Seed Data

```bash
psql -U your_username -d chatbot_platform -f database/seed.sql
```

### 4. (Optional) Use Prisma

If you prefer Prisma ORM:

```bash
# Create .env file
echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/chatbot_platform\"" > .env

# Copy prisma schema
mkdir prisma
cp database/prisma-schema.prisma prisma/schema.prisma

# Generate Prisma Client
npx prisma generate

# (Optional) View data in Prisma Studio
npx prisma studio
```

## RAG Chatbot Architecture

### How It Works

```
User Question
    ↓
1. Identify tenant by domain
    ↓
2. Generate embedding for question (Gemini API)
    ↓
3. Semantic search in chatbot_chunks (filtered by website_id)
    ↓
4. Retrieve top 5 relevant chunks
    ↓
5. Build prompt with context + system_prompt
    ↓
6. Send to Gemini API
    ↓
7. Return answer to user
```

### Vector Embeddings Setup (Optional)

For production RAG system, install pgvector:

```sql
-- Enable pgvector extension
CREATE EXTENSION vector;

-- Add embedding column to chatbot_chunks
ALTER TABLE chatbot_chunks 
ADD COLUMN embedding vector(768);

-- Create vector index for fast similarity search
CREATE INDEX idx_chunks_embedding 
ON chatbot_chunks 
USING ivfflat (embedding vector_cosine_ops);
```

Then generate embeddings for all chunks:
```javascript
// Example with Gemini API
const { GoogleGenerativeAI } = require("@google/generative-ai");

for (const chunk of chunks) {
  const embedding = await genAI.embedContent({
    content: chunk.chunk_text,
    model: "embedding-001"
  });
  
  await prisma.chatbotChunk.update({
    where: { id: chunk.id },
    data: { embedding: embedding.values }
  });
}
```

### Semantic Search Query

```sql
-- Find most relevant chunks for a question
SELECT 
  c.chunk_text,
  d.title,
  d.source_type,
  1 - (c.embedding <=> $1::vector) as similarity
FROM chatbot_chunks c
JOIN chatbot_documents d ON c.document_id = d.id
WHERE c.website_id = $2
ORDER BY c.embedding <=> $1::vector
LIMIT 5;
```

## Query Examples

### Get all content for a website
```sql
-- Get website by domain
SELECT * FROM websites WHERE domain = 'smilecare-dental.com';

-- Get all pages for that website
SELECT * FROM pages WHERE website_id = 1;

-- Get services with pricing
SELECT name, price, currency, full_description 
FROM services 
WHERE website_id = 1 AND is_active = true;

-- Get FAQ items by category
SELECT question, answer 
FROM faq_items 
WHERE website_id = 1 AND category = 'Pricing';
```

### Get context for RAG system
```sql
-- Get all documents for a website
SELECT d.title, d.raw_content, d.source_type
FROM chatbot_documents d
WHERE d.website_id = 1;

-- Get chunks with document info
SELECT 
  c.chunk_text,
  d.title as document_title,
  d.source_type
FROM chatbot_chunks c
JOIN chatbot_documents d ON c.document_id = d.id
WHERE c.website_id = 1
ORDER BY d.id, c.chunk_index;
```

## Prisma Usage Examples

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get website by domain
const website = await prisma.website.findUnique({
  where: { domain: 'smilecare-dental.com' },
  include: {
    pages: true,
    services: { where: { isActive: true } },
    faqItems: true,
    contactInfo: true
  }
});

// Get chunks for RAG (without embeddings for now)
const chunks = await prisma.chatbotChunk.findMany({
  where: { websiteId: website.id },
  include: {
    document: {
      select: {
        title: true,
        sourceType: true
      }
    }
  },
  orderBy: [
    { documentId: 'asc' },
    { chunkIndex: 'asc' }
  ]
});

// Search FAQs for direct answers
const faqs = await prisma.faqItem.findMany({
  where: {
    websiteId: website.id,
    OR: [
      { question: { contains: 'appointment', mode: 'insensitive' } },
      { answer: { contains: 'appointment', mode: 'insensitive' } }
    ]
  }
});
```

## Testing Chatbot Responses

Try these test questions for each website:

### SmileCare Dental:
- "What services do you offer?"
- "How much does teeth whitening cost?"
- "What are your working hours?"
- "Do you accept insurance?"
- "How do I schedule an emergency appointment?"
- "Tell me about Dr. Sarah Johnson"

### TechForge Solutions:
- "What technologies do you use?"
- "How much does a mobile app cost?"
- "What is your development process?"
- "Do you provide post-launch support?"
- "Can you help with cloud infrastructure?"
- "Show me your case studies"

### LearnHub Academy:
- "What courses do you offer?"
- "How much is a subscription?"
- "Do you offer certificates?"
- "Can I download courses for offline viewing?"
- "Is there a free trial?"
- "Tell me about student success stories"

## Database Maintenance

### Backup
```bash
pg_dump -U username chatbot_platform > backup_$(date +%Y%m%d).sql
```

### Reset Data
```bash
psql -U username -d chatbot_platform -f database/seed.sql
```

### Add New Website
```sql
-- Insert new website
INSERT INTO websites (name, domain, business_type, chatbot_name, system_prompt, language)
VALUES (
  'New Business',
  'newbusiness.com',
  'E-commerce',
  'ShopBot',
  'You are a helpful shopping assistant...',
  'en'
);

-- Get the new website_id
SELECT id FROM websites WHERE domain = 'newbusiness.com';

-- Add pages, services, FAQs, etc. with the new website_id
```

## Security Considerations

1. **Always filter by website_id** - Never allow cross-tenant data access
2. **Validate domain** - Ensure domain matches authenticated website
3. **Rate limiting** - Prevent abuse of chatbot API
4. **Input sanitization** - Escape user input before querying
5. **Connection pooling** - Use proper database connection management

## Performance Tips

1. **Indexes are already created** for common query patterns
2. **Use EXPLAIN ANALYZE** to optimize slow queries
3. **Consider partitioning** chatbot_chunks by website_id if data grows large
4. **Cache frequently accessed data** (website info, contact info)
5. **Use read replicas** for RAG queries in production

## Next Steps

1. ✅ Database schema created
2. ✅ Seed data loaded
3. ⬜ Generate embeddings for chunks
4. ⬜ Implement semantic search
5. ⬜ Build chatbot API endpoint
6. ⬜ Integrate with Gemini API
7. ⬜ Add conversation history tracking
8. ⬜ Build admin dashboard

## Support

For questions or issues with this database setup, refer to:
- PostgreSQL docs: https://www.postgresql.org/docs/
- Prisma docs: https://www.prisma.io/docs
- pgvector: https://github.com/pgvector/pgvector

---

**Database Version:** 1.0  
**Created:** 2026  
**PostgreSQL Version:** 14+  
**Compatible with:** Node.js, Prisma, Gemini API
