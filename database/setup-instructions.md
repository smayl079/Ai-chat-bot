# Database Setup Instructions

Quick start guide for setting up the multi-tenant chatbot database.

## Prerequisites

- PostgreSQL 14 or higher installed
- Database user with CREATE DATABASE privileges
- (Optional) Node.js 18+ if using Prisma

## Quick Setup (5 minutes)

### Option 1: Using psql Command Line

```bash
# 1. Connect to PostgreSQL
psql -U postgres

# 2. Create database
CREATE DATABASE chatbot_platform;

# 3. Exit psql
\q

# 4. Run schema file
psql -U postgres -d chatbot_platform -f database/schema.sql

# 5. Load seed data
psql -U postgres -d chatbot_platform -f database/seed.sql

# 6. Verify installation
psql -U postgres -d chatbot_platform -c "SELECT name, domain FROM websites;"
```

### Option 2: Using pgAdmin or GUI Client

1. Open pgAdmin (or your preferred PostgreSQL GUI)
2. Right-click "Databases" → "Create" → "Database"
3. Name: `chatbot_platform`
4. Click "Save"
5. Open Query Tool
6. Load and run `database/schema.sql`
7. Load and run `database/seed.sql`
8. Verify data exists

### Option 3: Using Docker

```bash
# 1. Start PostgreSQL container
docker run --name chatbot-db \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=chatbot_platform \
  -p 5432:5432 \
  -d postgres:14

# 2. Wait for container to be ready (10 seconds)
sleep 10

# 3. Run schema
docker exec -i chatbot-db psql -U postgres -d chatbot_platform < database/schema.sql

# 4. Load seed data
docker exec -i chatbot-db psql -U postgres -d chatbot_platform < database/seed.sql

# 5. Verify
docker exec -it chatbot-db psql -U postgres -d chatbot_platform -c "SELECT COUNT(*) FROM websites;"
```

## Verification

After setup, verify your database has data:

```sql
-- Check all tables have data
SELECT 'websites' as table_name, COUNT(*) as count FROM websites
UNION ALL
SELECT 'pages', COUNT(*) FROM pages
UNION ALL
SELECT 'faq_items', COUNT(*) FROM faq_items
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'contact_info', COUNT(*) FROM contact_info
UNION ALL
SELECT 'chatbot_documents', COUNT(*) FROM chatbot_documents
UNION ALL
SELECT 'chatbot_chunks', COUNT(*) FROM chatbot_chunks;
```

Expected results:
- websites: 3
- pages: 15
- faq_items: 24
- services: 18
- contact_info: 3
- chatbot_documents: 30
- chatbot_chunks: 90

## Configure Backend Connection

### Create .env file

In your backend directory, create a `.env` file:

```bash
# PostgreSQL Connection
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/chatbot_platform"

# Or for Prisma (same format)
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/chatbot_platform"
```

### Test Connection (Node.js)

```javascript
// test-db-connection.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testConnection() {
  try {
    const result = await pool.query('SELECT name, domain FROM websites');
    console.log('✅ Database connected successfully!');
    console.log('Websites:', result.rows);
    await pool.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

testConnection();
```

Run: `node test-db-connection.js`

## Using Prisma (Recommended)

### 1. Install Prisma

```bash
cd backend
npm install prisma @prisma/client
```

### 2. Initialize Prisma

```bash
# Create prisma folder
mkdir prisma

# Copy schema
cp ../database/prisma-schema.prisma prisma/schema.prisma

# Create .env with DATABASE_URL (see above)
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Test Prisma Connection

```javascript
// test-prisma.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const websites = await prisma.website.findMany({
    include: {
      _count: {
        select: {
          pages: true,
          services: true,
          faqItems: true
        }
      }
    }
  });
  
  console.log('✅ Prisma connected successfully!');
  console.log(JSON.stringify(websites, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run: `node test-prisma.js`

## Common Issues

### Issue: "psql: command not found"

**Solution:** Add PostgreSQL to PATH or use full path
```bash
# Windows
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres

# Mac (Homebrew)
/usr/local/bin/psql -U postgres
```

### Issue: "FATAL: password authentication failed"

**Solution:** Check your PostgreSQL password
```bash
psql -U postgres -W
# Enter password when prompted
```

### Issue: "database chatbot_platform does not exist"

**Solution:** Create it first
```sql
CREATE DATABASE chatbot_platform;
```

### Issue: "relation websites already exists"

**Solution:** Database already set up. To reset:
```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE chatbot_platform;"
psql -U postgres -c "CREATE DATABASE chatbot_platform;"

# Then run schema and seed again
```

### Issue: Prisma can't connect

**Solution:** Check DATABASE_URL format
```bash
# Correct format
postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Example
postgresql://postgres:mypassword@localhost:5432/chatbot_platform
```

## Next Steps

Once your database is set up:

1. ✅ Database created and seeded
2. ⬜ Test queries work
3. ⬜ Connect from your Node.js backend
4. ⬜ Implement RAG chatbot logic
5. ⬜ Generate embeddings for chunks
6. ⬜ Build API endpoints

See [README.md](./README.md) for full documentation and usage examples.

## Backup Your Database

Before making changes, always backup:

```bash
# Backup everything
pg_dump -U postgres chatbot_platform > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql -U postgres -d chatbot_platform < backup_20260311_123456.sql
```

## Need Help?

- Check PostgreSQL logs: Usually in `pg_log` directory
- Test connection: `psql -U postgres -h localhost -p 5432`
- Verify tables: `\dt` in psql
- Check data: `SELECT * FROM websites;`
