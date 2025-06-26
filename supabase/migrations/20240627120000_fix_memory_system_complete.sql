-- Complete fix for memory system
-- 1. Ensure vector extension is enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Drop and recreate the embedding column with correct type
ALTER TABLE public.memory_embeddings DROP COLUMN IF EXISTS embedding;
ALTER TABLE public.memory_embeddings ADD COLUMN embedding vector(1536);

-- 3. Drop and recreate the search_memory function
DROP FUNCTION IF EXISTS search_memory(VECTOR(1536), DECIMAL(3,2), INTEGER);

CREATE OR REPLACE FUNCTION search_memory(
    query_embedding VECTOR(1536),
    match_threshold DECIMAL(3,2) DEFAULT 0.7,
    match_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    content_text TEXT,
    content_type VARCHAR(50),
    content_id UUID,
    metadata JSONB,
    similarity DOUBLE PRECISION
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        me.id,
        me.content_text,
        me.content_type,
        me.content_id,
        me.metadata,
        1 - (me.embedding <=> query_embedding) AS similarity
    FROM memory_embeddings me
    WHERE me.embedding IS NOT NULL
    AND 1 - (me.embedding <=> query_embedding) > match_threshold
    ORDER BY me.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 4. Insert a test row with a valid embedding (1536 zeros for testing)
INSERT INTO public.memory_embeddings (
    content_text,
    content_type,
    content_id,
    embedding,
    metadata
) VALUES (
    'This is a test meeting about project planning and task management',
    'meeting',
    gen_random_uuid(),
    array_fill(0.0, ARRAY[1536])::vector(1536),
    '{"title": "Test Meeting", "date": "2024-01-01", "participants": ["test@example.com"]}'::jsonb
) ON CONFLICT DO NOTHING;

-- 5. Grant necessary permissions
GRANT EXECUTE ON FUNCTION search_memory(VECTOR(1536), DECIMAL(3,2), INTEGER) TO anon, authenticated;

-- 6. Verify the function works
DO $$
DECLARE
    test_embedding vector(1536) := array_fill(0.1, ARRAY[1536])::vector(1536);
    result_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO result_count FROM search_memory(test_embedding, 0.1, 5);
    RAISE NOTICE 'Test search returned % results', result_count;
END $$; 