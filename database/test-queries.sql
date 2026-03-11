-- ============================================
-- Sample SQL Queries for Testing
-- ============================================

-- 1. List all websites with their basic info
SELECT 
  id,
  name,
  domain,
  business_type,
  chatbot_name,
  is_active
FROM websites
ORDER BY id;

-- ============================================

-- 2. Get complete profile for SmileCare Dental
SELECT 
  w.name as website,
  w.domain,
  w.business_type,
  w.chatbot_name,
  c.email,
  c.phone,
  c.working_hours
FROM websites w
LEFT JOIN contact_info c ON w.id = c.website_id
WHERE w.domain = 'smilecare-dental.com';

-- ============================================

-- 3. Get all services with prices for TechForge
SELECT 
  name,
  short_description,
  price,
  currency,
  is_active
FROM services
WHERE website_id = (SELECT id FROM websites WHERE domain = 'techforge-solutions.io')
ORDER BY price;

-- ============================================

-- 4. Get FAQ items by category for LearnHub
SELECT 
  category,
  question,
  answer
FROM faq_items
WHERE website_id = (SELECT id FROM websites WHERE domain = 'learnhub-academy.edu')
ORDER BY category, id;

-- ============================================

-- 5. Count records per website
SELECT 
  w.name as website,
  COUNT(DISTINCT p.id) as pages,
  COUNT(DISTINCT f.id) as faqs,
  COUNT(DISTINCT s.id) as services,
  COUNT(DISTINCT d.id) as documents,
  COUNT(DISTINCT ch.id) as chunks
FROM websites w
LEFT JOIN pages p ON w.id = p.website_id
LEFT JOIN faq_items f ON w.id = f.website_id
LEFT JOIN services s ON w.id = s.website_id
LEFT JOIN chatbot_documents d ON w.id = d.website_id
LEFT JOIN chatbot_chunks ch ON w.id = ch.website_id
GROUP BY w.id, w.name
ORDER BY w.id;

-- ============================================

-- 6. Get all pages for a specific website
SELECT 
  title,
  slug,
  LEFT(content, 100) as content_preview,
  created_at
FROM pages
WHERE website_id = 1
ORDER BY id;

-- ============================================

-- 7. Get chatbot documents with chunk counts
SELECT 
  d.id,
  d.title,
  d.source_type,
  COUNT(c.id) as chunk_count,
  LEFT(d.raw_content, 150) as content_preview
FROM chatbot_documents d
LEFT JOIN chatbot_chunks c ON d.id = c.document_id
WHERE d.website_id = 1
GROUP BY d.id, d.title, d.source_type, d.raw_content
ORDER BY d.id;

-- ============================================

-- 8. Get sample chunks for RAG system
SELECT 
  ch.chunk_index,
  ch.chunk_text,
  d.title as document_title,
  d.source_type
FROM chatbot_chunks ch
JOIN chatbot_documents d ON ch.document_id = d.id
WHERE ch.website_id = 2
ORDER BY d.id, ch.chunk_index
LIMIT 10;

-- ============================================

-- 9. Search for specific content (example: teeth whitening)
SELECT 
  'page' as source,
  p.title,
  LEFT(p.content, 200) as preview
FROM pages p
WHERE p.website_id = 1 
  AND (p.content ILIKE '%whitening%' OR p.title ILIKE '%whitening%')
UNION ALL
SELECT 
  'service' as source,
  s.name as title,
  LEFT(s.full_description, 200) as preview
FROM services s
WHERE s.website_id = 1 
  AND (s.name ILIKE '%whitening%' OR s.full_description ILIKE '%whitening%')
UNION ALL
SELECT 
  'faq' as source,
  f.question as title,
  LEFT(f.answer, 200) as preview
FROM faq_items f
WHERE f.website_id = 1 
  AND (f.question ILIKE '%whitening%' OR f.answer ILIKE '%whitening%');

-- ============================================

-- 10. Get all active services across all websites
SELECT 
  w.name as website,
  s.name as service_name,
  s.price,
  s.currency,
  LEFT(s.short_description, 100) as description
FROM services s
JOIN websites w ON s.website_id = w.id
WHERE s.is_active = true
ORDER BY w.name, s.price;

-- ============================================

-- 11. Find cheapest and most expensive services per website
SELECT 
  w.name as website,
  MIN(s.price) as cheapest_service,
  MAX(s.price) as most_expensive_service,
  ROUND(AVG(s.price), 2) as average_price,
  s.currency
FROM services s
JOIN websites w ON s.website_id = w.id
WHERE s.price IS NOT NULL
GROUP BY w.id, w.name, s.currency
ORDER BY w.name;

-- ============================================

-- 12. Get complete context for a chatbot query (all relevant data)
-- This is what you'd fetch for RAG context
WITH website_info AS (
  SELECT * FROM websites WHERE domain = 'smilecare-dental.com'
)
SELECT 
  'website' as data_type,
  wi.name as title,
  wi.system_prompt as content,
  NULL as category
FROM website_info wi
UNION ALL
SELECT 
  'contact' as data_type,
  'Contact Information' as title,
  CONCAT('Email: ', c.email, ', Phone: ', c.phone, ', Hours: ', c.working_hours) as content,
  NULL as category
FROM contact_info c
WHERE c.website_id = (SELECT id FROM website_info)
UNION ALL
SELECT 
  'page' as data_type,
  p.title,
  p.content,
  NULL as category
FROM pages p
WHERE p.website_id = (SELECT id FROM website_info)
UNION ALL
SELECT 
  'faq' as data_type,
  f.question as title,
  f.answer as content,
  f.category
FROM faq_items f
WHERE f.website_id = (SELECT id FROM website_info)
UNION ALL
SELECT 
  'service' as data_type,
  s.name as title,
  s.full_description as content,
  CAST(s.price as TEXT) as category
FROM services s
WHERE s.website_id = (SELECT id FROM website_info) AND s.is_active = true;

-- ============================================

-- 13. Simulate a semantic search (text-based, without embeddings)
-- Search for documents mentioning "price" or "cost"
SELECT 
  d.title,
  d.source_type,
  ch.chunk_text,
  w.name as website
FROM chatbot_chunks ch
JOIN chatbot_documents d ON ch.document_id = d.id
JOIN websites w ON ch.website_id = w.id
WHERE ch.website_id = 3
  AND (ch.chunk_text ILIKE '%price%' OR ch.chunk_text ILIKE '%cost%')
LIMIT 5;

-- ============================================

-- 14. Get website statistics
SELECT 
  w.name as website,
  w.business_type,
  w.created_at::date as created_date,
  (SELECT COUNT(*) FROM pages WHERE website_id = w.id) as total_pages,
  (SELECT COUNT(*) FROM services WHERE website_id = w.id AND is_active = true) as active_services,
  (SELECT COUNT(*) FROM faq_items WHERE website_id = w.id) as total_faqs,
  (SELECT COUNT(*) FROM chatbot_chunks WHERE website_id = w.id) as total_chunks,
  w.is_active
FROM websites w
ORDER BY w.id;

-- ============================================

-- 15. Test multi-tenancy isolation
-- Verify that each website has completely separate data
SELECT 
  website_id,
  COUNT(*) as total_records,
  COUNT(DISTINCT document_id) as unique_documents
FROM chatbot_chunks
GROUP BY website_id
ORDER BY website_id;
