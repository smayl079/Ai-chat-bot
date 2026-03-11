# Database Schema Quick Reference

## Entity Relationship Diagram

```
┌──────────────────────┐
│      WEBSITES        │  ← Main tenant table
│──────────────────────│
│ id (PK)              │
│ name                 │
│ domain (UNIQUE)      │◄──── Used for tenant identification
│ business_type        │
│ chatbot_name         │
│ system_prompt        │
│ language             │
│ is_active            │
│ created_at           │
│ updated_at           │
└──────┬───────────────┘
       │
       │ (One website has many...)
       │
       ├─────────────────────┬─────────────────┬──────────────────┬──────────────────┐
       │                     │                 │                  │                  │
       ▼                     ▼                 ▼                  ▼                  ▼
┌─────────────┐    ┌──────────────┐    ┌──────────┐     ┌─────────────┐   ┌──────────────┐
│   PAGES     │    │  FAQ_ITEMS   │    │ SERVICES │     │ CONTACT_INFO│   │   CHATBOT    │
│─────────────│    │──────────────│    │──────────│     │─────────────│   │  DOCUMENTS   │
│ id (PK)     │    │ id (PK)      │    │ id (PK)  │     │ id (PK)     │   │──────────────│
│ website_id  │    │ website_id   │    │website_id│     │website_id   │   │ id (PK)      │
│ title       │    │ question     │    │ name     │     │ email       │   │ website_id   │
│ slug        │    │ answer       │    │ short_   │     │ phone       │   │ source_type  │
│ content     │    │ category     │    │  descr.  │     │ address     │   │ title        │
│ meta_descr. │    │ created_at   │    │ full_    │     │ working_hrs │   │ raw_content  │
│ created_at  │    └──────────────┘    │  descr.  │     │ whatsapp    │   │ source_url   │
│ updated_at  │                         │ price    │     │ created_at  │   │ created_at   │
└─────────────┘                         │ currency │     │ updated_at  │   │ updated_at   │
                                        │ is_active│     └─────────────┘   └──────┬───────┘
                                        │created_at│          (1:1)               │
                                        │updated_at│                              │
                                        └──────────┘                              │
                                                                                  │
                                                                                  │
                                                                                  ▼
                                                                         ┌──────────────┐
                                                                         │   CHATBOT    │
                                                                         │   CHUNKS     │
                                                                         │──────────────│
                                                                         │ id (PK)      │
                                                                         │ website_id   │
                                                                         │ document_id  │
                                                                         │ chunk_text   │
                                                                         │ chunk_index  │
                                                                         │ created_at   │
                                                                         └──────────────┘
```

## Table Relationships

### 1. **websites** (Parent/Tenant)
```sql
ONE website
  ├─ HAS MANY pages
  ├─ HAS MANY faq_items
  ├─ HAS MANY services
  ├─ HAS ONE contact_info
  ├─ HAS MANY chatbot_documents
  └─ HAS MANY chatbot_chunks
```

### 2. **chatbot_documents** → **chatbot_chunks**
```sql
ONE document
  └─ HAS MANY chunks (ordered by chunk_index)
```

## Data Isolation (Multi-Tenancy)

Every query MUST filter by `website_id`:

```sql
✅ CORRECT - Tenant isolated
SELECT * FROM pages WHERE website_id = 1;

❌ WRONG - Cross-tenant access
SELECT * FROM pages WHERE slug = 'about';
```

## Indexes for Performance

| Table | Index | Purpose |
|-------|-------|---------|
| websites | domain | Fast tenant lookup |
| websites | is_active | Filter active sites |
| pages | website_id | Tenant isolation |
| pages | (website_id, slug) | Unique page per site |
| faq_items | website_id | Tenant isolation |
| faq_items | (website_id, category) | Filter by category |
| services | website_id | Tenant isolation |
| services | (website_id, is_active) | Active services only |
| contact_info | website_id | Tenant isolation |
| chatbot_documents | website_id | Tenant isolation |
| chatbot_documents | (website_id, source_type) | Filter by source |
| chatbot_chunks | website_id | Tenant isolation |
| chatbot_chunks | document_id | Get chunks for doc |
| chatbot_chunks | (document_id, chunk_index) | Ordered retrieval |

## Common Query Patterns

### 1. Get Website by Domain (Tenant Identification)
```sql
SELECT * FROM websites 
WHERE domain = 'smilecare-dental.com' 
  AND is_active = true;
```

### 2. Get All Pages for Website
```sql
SELECT title, content 
FROM pages 
WHERE website_id = 1
ORDER BY created_at;
```

### 3. Get Active Services with Pricing
```sql
SELECT name, price, currency, full_description
FROM services
WHERE website_id = 1 
  AND is_active = true
ORDER BY price;
```

### 4. Search FAQs
```sql
SELECT question, answer, category
FROM faq_items
WHERE website_id = 1
  AND (question ILIKE '%appointment%' 
       OR answer ILIKE '%appointment%');
```

### 5. Get Contact Info
```sql
SELECT email, phone, address, working_hours
FROM contact_info
WHERE website_id = 1;
```

### 6. Get Chunks for RAG (Keyword Search)
```sql
SELECT 
  c.chunk_text,
  d.title,
  d.source_type
FROM chatbot_chunks c
JOIN chatbot_documents d ON c.document_id = d.id
WHERE c.website_id = 1
  AND c.chunk_text ILIKE '%specific keyword%'
ORDER BY d.id, c.chunk_index
LIMIT 10;
```

### 7. Get All Chunks for a Website (Ordered)
```sql
SELECT 
  c.chunk_text,
  c.chunk_index,
  d.title as document_title
FROM chatbot_chunks c
JOIN chatbot_documents d ON c.document_id = d.id
WHERE c.website_id = 1
ORDER BY d.id, c.chunk_index;
```

### 8. Get Complete Website Context (for RAG)
```sql
-- Get everything for a website in one query
SELECT 
  'page' as type,
  title,
  content as text
FROM pages 
WHERE website_id = 1

UNION ALL

SELECT 
  'faq' as type,
  question as title,
  answer as text
FROM faq_items 
WHERE website_id = 1

UNION ALL

SELECT 
  'service' as type,
  name as title,
  full_description as text
FROM services 
WHERE website_id = 1 AND is_active = true;
```

## Data Flow for RAG Chatbot

```
User Question: "How much does teeth whitening cost?"
         ↓
    [Extract Domain]
         ↓
smilecare-dental.com → website_id = 1
         ↓
    [Keyword Search]
         ↓
SELECT FROM chatbot_chunks 
WHERE website_id = 1 
  AND chunk_text ILIKE '%whitening%'
         ↓
    [Retrieved Chunks]
    1. "Professional teeth whitening costs $499..."
    2. "Teeth whitening takes 90 minutes..."
    3. "Transform your smile with cosmetic services..."
         ↓
    [Build Context]
         ↓
Context = system_prompt + retrieved_chunks + question
         ↓
    [Send to Gemini API]
         ↓
Response: "Teeth whitening at SmileCare costs $499 
           and takes approximately 90 minutes..."
```

## Record Counts (Seed Data)

| Table | Total | Per Website |
|-------|-------|-------------|
| websites | 3 | - |
| pages | 15 | 5 each |
| faq_items | 24 | 8 each |
| services | 18 | 6 each |
| contact_info | 3 | 1 each |
| chatbot_documents | 30 | 10 each |
| chatbot_chunks | 90 | 30 each |

## Sample Websites

| ID | Name | Domain | Type |
|----|------|--------|------|
| 1 | SmileCare Dental | smilecare-dental.com | Healthcare |
| 2 | TechForge Solutions | techforge-solutions.io | Software Agency |
| 3 | LearnHub Academy | learnhub-academy.edu | Online Education |

## Foreign Key Relationships

```sql
pages.website_id         → websites.id (CASCADE)
faq_items.website_id     → websites.id (CASCADE)
services.website_id      → websites.id (CASCADE)
contact_info.website_id  → websites.id (CASCADE)
chatbot_documents.website_id → websites.id (CASCADE)
chatbot_chunks.website_id    → websites.id (CASCADE)
chatbot_chunks.document_id   → chatbot_documents.id (CASCADE)
```

**CASCADE** means: If you delete a website, all related data is automatically deleted.

## Timestamps

All tables (except chatbot_chunks) have:
- `created_at` - Auto-set on insert
- `updated_at` - Auto-updated via trigger

## Using with Prisma

```javascript
// Get website with all relations
const website = await prisma.website.findUnique({
  where: { domain: 'smilecare-dental.com' },
  include: {
    pages: true,
    services: { where: { isActive: true } },
    faqItems: true,
    contactInfo: true,
    chatbotDocuments: {
      include: {
        chunks: {
          orderBy: { chunkIndex: 'asc' }
        }
      }
    }
  }
});
```

## Adding Vector Search (Future)

To enable semantic search with embeddings:

```sql
-- 1. Install pgvector
CREATE EXTENSION vector;

-- 2. Add embedding column
ALTER TABLE chatbot_chunks 
ADD COLUMN embedding vector(768);

-- 3. Create vector index
CREATE INDEX idx_chunks_embedding 
ON chatbot_chunks 
USING ivfflat (embedding vector_cosine_ops);

-- 4. Query similar chunks
SELECT chunk_text, 
       1 - (embedding <=> $1::vector) as similarity
FROM chatbot_chunks
WHERE website_id = $2
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

## Security Checklist

- ✅ Always filter by website_id
- ✅ Never expose data across tenants
- ✅ Validate domain before queries
- ✅ Use prepared statements (prevent SQL injection)
- ✅ Implement rate limiting
- ✅ Log all database access
- ✅ Encrypt sensitive data
- ✅ Regular backups

## Performance Tips

1. **Always use indexes** - website_id filters use indexes
2. **Limit result sets** - Use LIMIT in queries
3. **Cache static data** - website info, contact info
4. **Connection pooling** - Use pg Pool, not individual connections
5. **Prepared statements** - Better performance + security
6. **EXPLAIN ANALYZE** - Check query plans for slow queries

## Quick Commands

```bash
# Connect to database
psql -U postgres -d chatbot_platform

# List tables
\dt

# Describe table structure
\d websites

# Show all websites
SELECT * FROM websites;

# Count all records
SELECT 'pages' as table, COUNT(*) FROM pages
UNION ALL SELECT 'chunks', COUNT(*) FROM chatbot_chunks;

# Exit psql
\q
```
