// Example: Query chatbot data for RAG system
// This demonstrates how to fetch context for a chatbot query

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/chatbot_platform'
});

/**
 * Get website by domain (tenant identification)
 */
async function getWebsiteByDomain(domain) {
  const result = await pool.query(
    'SELECT * FROM websites WHERE domain = $1 AND is_active = true',
    [domain]
  );
  return result.rows[0];
}

/**
 * Get all context for a website (for RAG system)
 */
async function getWebsiteContext(websiteId) {
  const [website, pages, faqs, services, contact, chunks] = await Promise.all([
    // Basic website info
    pool.query('SELECT * FROM websites WHERE id = $1', [websiteId]),
    
    // All pages
    pool.query(
      'SELECT title, slug, content FROM pages WHERE website_id = $1',
      [websiteId]
    ),
    
    // All FAQs
    pool.query(
      'SELECT question, answer, category FROM faq_items WHERE website_id = $1',
      [websiteId]
    ),
    
    // Active services
    pool.query(
      'SELECT name, full_description, price, currency FROM services WHERE website_id = $1 AND is_active = true',
      [websiteId]
    ),
    
    // Contact info
    pool.query(
      'SELECT * FROM contact_info WHERE website_id = $1',
      [websiteId]
    ),
    
    // Pre-chunked documents for RAG
    pool.query(
      `SELECT 
        c.chunk_text, 
        d.title, 
        d.source_type 
      FROM chatbot_chunks c
      JOIN chatbot_documents d ON c.document_id = d.id
      WHERE c.website_id = $1
      ORDER BY d.id, c.chunk_index`,
      [websiteId]
    )
  ]);
  
  return {
    website: website.rows[0],
    pages: pages.rows,
    faqs: faqs.rows,
    services: services.rows,
    contact: contact.rows[0],
    chunks: chunks.rows
  };
}

/**
 * Simple keyword search in chunks (without embeddings)
 */
async function searchKeywordInChunks(websiteId, keyword) {
  const result = await pool.query(
    `SELECT 
      c.chunk_text,
      d.title as document_title,
      d.source_type
    FROM chatbot_chunks c
    JOIN chatbot_documents d ON c.document_id = d.id
    WHERE c.website_id = $1 
      AND c.chunk_text ILIKE $2
    ORDER BY 
      CASE 
        WHEN c.chunk_text ILIKE $3 THEN 1 
        ELSE 2 
      END,
      d.id, c.chunk_index
    LIMIT 5`,
    [websiteId, `%${keyword}%`, `%${keyword}%`]
  );
  
  return result.rows;
}

/**
 * Get FAQ by exact or similar question
 */
async function findRelevantFAQ(websiteId, question) {
  const result = await pool.query(
    `SELECT 
      question,
      answer,
      category
    FROM faq_items
    WHERE website_id = $1 
      AND (
        question ILIKE $2 
        OR question ILIKE $3
      )
    ORDER BY 
      CASE 
        WHEN LOWER(question) = LOWER($4) THEN 1
        WHEN question ILIKE $2 THEN 2
        ELSE 3
      END
    LIMIT 3`,
    [websiteId, `%${question}%`, `% ${question} %`, question]
  );
  
  return result.rows;
}

/**
 * Build context string for chatbot prompt
 */
function buildContextPrompt(context) {
  let prompt = `Website: ${context.website.name}\n`;
  prompt += `Business Type: ${context.website.business_type}\n\n`;
  
  if (context.contact) {
    prompt += `Contact Information:\n`;
    prompt += `- Email: ${context.contact.email}\n`;
    prompt += `- Phone: ${context.contact.phone}\n`;
    prompt += `- Working Hours: ${context.contact.working_hours}\n\n`;
  }
  
  if (context.services.length > 0) {
    prompt += `Services:\n`;
    context.services.forEach(service => {
      const price = service.price ? `${service.currency} ${service.price}` : 'Contact for pricing';
      prompt += `- ${service.name} (${price}): ${service.full_description.substring(0, 150)}...\n`;
    });
    prompt += '\n';
  }
  
  if (context.faqs.length > 0) {
    prompt += `Frequently Asked Questions:\n`;
    context.faqs.slice(0, 5).forEach(faq => {
      prompt += `Q: ${faq.question}\n`;
      prompt += `A: ${faq.answer}\n\n`;
    });
  }
  
  return prompt;
}

// Example usage
async function exampleQueries() {
  try {
    console.log('🤖 RAG Chatbot Query Examples\n');
    
    // Example 1: Get website context
    console.log('1️⃣  Getting context for SmileCare Dental...');
    const website = await getWebsiteByDomain('smilecare-dental.com');
    console.log(`   Found: ${website.name} (ID: ${website.id})`);
    console.log(`   Chatbot Name: ${website.chatbot_name}`);
    console.log('');
    
    // Example 2: Search for specific information
    console.log('2️⃣  Searching for "teeth whitening" information...');
    const whiteningInfo = await searchKeywordInChunks(website.id, 'whitening');
    console.log(`   Found ${whiteningInfo.length} relevant chunks:`);
    whiteningInfo.forEach((chunk, idx) => {
      console.log(`   ${idx + 1}. ${chunk.document_title} (${chunk.source_type})`);
      console.log(`      ${chunk.chunk_text.substring(0, 100)}...`);
    });
    console.log('');
    
    // Example 3: Find FAQ
    console.log('3️⃣  Looking for FAQ about pricing...');
    const pricingFAQ = await findRelevantFAQ(website.id, 'How much does');
    if (pricingFAQ.length > 0) {
      console.log(`   Found ${pricingFAQ.length} relevant FAQs:`);
      pricingFAQ.forEach(faq => {
        console.log(`   Q: ${faq.question}`);
        console.log(`   A: ${faq.answer.substring(0, 150)}...`);
        console.log('');
      });
    }
    
    // Example 4: Build complete context
    console.log('4️⃣  Building complete context for chatbot...');
    const fullContext = await getWebsiteContext(website.id);
    console.log(`   Context includes:`);
    console.log(`   - ${fullContext.pages.length} pages`);
    console.log(`   - ${fullContext.faqs.length} FAQs`);
    console.log(`   - ${fullContext.services.length} services`);
    console.log(`   - ${fullContext.chunks.length} text chunks`);
    console.log('');
    
    // Example 5: Generate prompt for LLM
    console.log('5️⃣  Sample prompt for LLM:');
    console.log('   ─────────────────────────────────');
    const prompt = buildContextPrompt(fullContext);
    console.log(prompt.substring(0, 500));
    console.log('   [... truncated for display ...]');
    console.log('   ─────────────────────────────────');
    console.log('');
    
    console.log('✨ Query examples completed!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  exampleQueries();
}

// Export functions for use in other files
module.exports = {
  getWebsiteByDomain,
  getWebsiteContext,
  searchKeywordInChunks,
  findRelevantFAQ,
  buildContextPrompt
};
