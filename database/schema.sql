-- ============================================
-- Multi-Tenant Chatbot Platform Database Schema
-- ============================================

-- Enable UUID extension (optional, if using UUIDs)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. WEBSITES TABLE
-- Core table for multi-tenancy
-- ============================================
CREATE TABLE websites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    chatbot_name VARCHAR(100) NOT NULL DEFAULT 'Assistant',
    system_prompt TEXT,
    language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for domain lookups (primary tenant identifier)
CREATE INDEX idx_websites_domain ON websites(domain);
CREATE INDEX idx_websites_is_active ON websites(is_active);

-- ============================================
-- 2. PAGES TABLE
-- Website content pages
-- ============================================
CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    website_id INTEGER NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(website_id, slug)
);

-- Indexes for multi-tenant queries
CREATE INDEX idx_pages_website_id ON pages(website_id);
CREATE INDEX idx_pages_slug ON pages(website_id, slug);

-- ============================================
-- 3. FAQ ITEMS TABLE
-- Frequently asked questions
-- ============================================
CREATE TABLE faq_items (
    id SERIAL PRIMARY KEY,
    website_id INTEGER NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for tenant isolation and category filtering
CREATE INDEX idx_faq_website_id ON faq_items(website_id);
CREATE INDEX idx_faq_category ON faq_items(website_id, category);

-- ============================================
-- 4. SERVICES TABLE
-- Business services or products
-- ============================================
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    website_id INTEGER NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    short_description TEXT,
    full_description TEXT NOT NULL,
    price DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for service queries
CREATE INDEX idx_services_website_id ON services(website_id);
CREATE INDEX idx_services_is_active ON services(website_id, is_active);

-- ============================================
-- 5. CONTACT INFO TABLE
-- Contact information per website
-- ============================================
CREATE TABLE contact_info (
    id SERIAL PRIMARY KEY,
    website_id INTEGER NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    working_hours TEXT,
    whatsapp VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(website_id)
);

-- Index for tenant lookup
CREATE INDEX idx_contact_website_id ON contact_info(website_id);

-- ============================================
-- 6. CHATBOT DOCUMENTS TABLE
-- Source documents for RAG system
-- ============================================
CREATE TABLE chatbot_documents (
    id SERIAL PRIMARY KEY,
    website_id INTEGER NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL, -- 'page', 'faq', 'service', 'custom', 'blog', etc.
    title VARCHAR(255) NOT NULL,
    raw_content TEXT NOT NULL,
    source_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for document retrieval
CREATE INDEX idx_documents_website_id ON chatbot_documents(website_id);
CREATE INDEX idx_documents_source_type ON chatbot_documents(website_id, source_type);

-- ============================================
-- 7. CHATBOT CHUNKS TABLE
-- Text chunks for vector embeddings (RAG)
-- ============================================
CREATE TABLE chatbot_chunks (
    id SERIAL PRIMARY KEY,
    website_id INTEGER NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
    document_id INTEGER NOT NULL REFERENCES chatbot_documents(id) ON DELETE CASCADE,
    chunk_text TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    -- embedding VECTOR(768), -- Uncomment if using pgvector for embeddings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(document_id, chunk_index)
);

-- Indexes for chunk retrieval
CREATE INDEX idx_chunks_website_id ON chatbot_chunks(website_id);
CREATE INDEX idx_chunks_document_id ON chatbot_chunks(document_id);
-- CREATE INDEX idx_chunks_embedding ON chatbot_chunks USING ivfflat (embedding vector_cosine_ops); -- For pgvector

-- ============================================
-- OPTIONAL: Conversation History Tables
-- ============================================

-- Uncomment if you want to store chat history

-- CREATE TABLE conversations (
--     id SERIAL PRIMARY KEY,
--     website_id INTEGER NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
--     session_id VARCHAR(255) NOT NULL,
--     user_ip VARCHAR(45),
--     user_agent TEXT,
--     started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- CREATE INDEX idx_conversations_website_id ON conversations(website_id);
-- CREATE INDEX idx_conversations_session_id ON conversations(session_id);

-- CREATE TABLE messages (
--     id SERIAL PRIMARY KEY,
--     conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
--     role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
--     content TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);

-- ============================================
-- TRIGGER: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_websites_updated_at BEFORE UPDATE ON websites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chatbot_documents_updated_at BEFORE UPDATE ON chatbot_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
