// Test Database Connection with pg (Node.js)
// Run: node database/test-connection.js

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/chatbot_platform'
});

async function testConnection() {
  console.log('🔄 Testing database connection...\n');
  
  try {
    // Test 1: Basic connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully!');
    console.log('   Server time:', result.rows[0].now);
    console.log('');
    
    // Test 2: Get all websites
    const websites = await pool.query(`
      SELECT id, name, domain, business_type 
      FROM websites 
      ORDER BY id
    `);
    
    console.log('📊 Websites in database:');
    websites.rows.forEach(site => {
      console.log(`   ${site.id}. ${site.name}`);
      console.log(`      Domain: ${site.domain}`);
      console.log(`      Type: ${site.business_type}`);
      console.log('');
    });
    
    // Test 3: Get record counts
    const counts = await pool.query(`
      SELECT 
        'websites' as table_name, 
        COUNT(*)::int as count 
      FROM websites
      UNION ALL
      SELECT 'pages', COUNT(*)::int FROM pages
      UNION ALL
      SELECT 'faq_items', COUNT(*)::int FROM faq_items
      UNION ALL
      SELECT 'services', COUNT(*)::int FROM services
      UNION ALL
      SELECT 'contact_info', COUNT(*)::int FROM contact_info
      UNION ALL
      SELECT 'chatbot_documents', COUNT(*)::int FROM chatbot_documents
      UNION ALL
      SELECT 'chatbot_chunks', COUNT(*)::int FROM chatbot_chunks
    `);
    
    console.log('📈 Database statistics:');
    counts.rows.forEach(row => {
      console.log(`   ${row.table_name.padEnd(20)} ${row.count} records`);
    });
    console.log('');
    
    // Test 4: Sample query - Get first service from each website
    const services = await pool.query(`
      SELECT 
        w.name as website,
        s.name as service,
        s.price,
        s.currency
      FROM services s
      JOIN websites w ON s.website_id = w.id
      WHERE s.id IN (
        SELECT MIN(id) FROM services GROUP BY website_id
      )
      ORDER BY w.id
    `);
    
    console.log('🛍️  Sample service from each website:');
    services.rows.forEach(svc => {
      const price = svc.price ? `${svc.currency} ${svc.price}` : 'N/A';
      console.log(`   ${svc.website}: ${svc.service} (${price})`);
    });
    console.log('');
    
    // Test 5: Check if chunks are ready for chatbot
    const chunkStats = await pool.query(`
      SELECT 
        w.name as website,
        COUNT(DISTINCT d.id) as documents,
        COUNT(c.id) as chunks,
        ROUND(AVG(LENGTH(c.chunk_text))) as avg_chunk_length
      FROM websites w
      LEFT JOIN chatbot_documents d ON w.id = d.website_id
      LEFT JOIN chatbot_chunks c ON d.id = c.document_id
      GROUP BY w.id, w.name
      ORDER BY w.id
    `);
    
    console.log('🤖 Chatbot data readiness:');
    chunkStats.rows.forEach(stat => {
      console.log(`   ${stat.website}:`);
      console.log(`      Documents: ${stat.documents}`);
      console.log(`      Chunks: ${stat.chunks}`);
      console.log(`      Avg chunk size: ${stat.avg_chunk_length} chars`);
      console.log('');
    });
    
    console.log('✨ All tests passed! Database is ready for use.\n');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('   Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check if PostgreSQL is running');
    console.error('   2. Verify DATABASE_URL in .env file');
    console.error('   3. Ensure database "chatbot_platform" exists');
    console.error('   4. Check username/password are correct');
    console.error('   5. Run: psql -U postgres -d chatbot_platform -c "SELECT 1"');
  } finally {
    await pool.end();
  }
}

testConnection();
