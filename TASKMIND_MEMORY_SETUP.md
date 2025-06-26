# TaskMind Memory Setup Guide

This guide will help you set up the TaskMind Memory feature, which provides long-term memory capabilities using vector embeddings and semantic search.

## 🧠 Overview

TaskMind Memory is a long-term memory system that:
- Stores important past data (summaries, action items, decisions)
- Surfaces relevant past context automatically
- Lets users "recall" any meeting/task by natural language
- Uses OpenAI embeddings and Supabase pgvector for storage

## 📋 Prerequisites

- Supabase project with pgvector extension enabled
- OpenAI API key for generating embeddings
- Node.js and npm/yarn installed
- Access to Supabase CLI

## 🚀 Setup Steps

### 1. Database Setup

First, apply the memory system migration:

```bash
# Apply the memory system migration
npx supabase db push

# Or if using migrations directly
npx supabase migration up
```

This will create:
- `memory_embeddings` table for storing vector embeddings
- `memory_search_logs` table for tracking search queries
- Database triggers for automatic embedding creation
- Search function for similarity queries

### 2. Enable pgvector Extension

Ensure the pgvector extension is enabled in your Supabase project:

```sql
-- This should be done automatically by the migration
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. Deploy Memory Function

Deploy the memory Edge Function:

```bash
# Deploy the memory function
npx supabase functions deploy memory

# Set environment variables
npx supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Environment Variables

Add the following to your `.env.local` file:

```env
# OpenAI API Key for embeddings
OPENAI_API_KEY=your_openai_api_key_here

# Supabase configuration (should already be set)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Update TypeScript Types

After applying the migration, regenerate your Supabase types:

```bash
# Generate types from your database
npx supabase gen types typescript --project-id your_project_id > src/integrations/supabase/types.ts
```

### 6. Install Dependencies

The memory system uses existing dependencies, but ensure you have:

```bash
npm install date-fns
```

## 🔧 Configuration

### Memory Function Configuration

The memory function supports the following configuration:

- **Embedding Model**: OpenAI text-embedding-3-small (1536 dimensions)
- **Similarity Threshold**: Default 0.7 (70% similarity)
- **Max Results**: Default 10 results per search
- **Batch Size**: 50 items processed at once for updates

### Database Triggers

The system automatically creates embeddings when:
- New meetings are created/updated
- New tasks are created/updated
- New summaries are created/updated

## 🎯 Usage

### Basic Search

```typescript
import { useMemory } from '@/hooks/useMemory';

const { searchMemory } = useMemory();

// Search for relevant content
await searchMemory.mutateAsync({
  query: "What was discussed in my last design meeting?",
  threshold: 0.7,
  limit: 10
});
```

### Update Embeddings

```typescript
import { useMemory } from '@/hooks/useMemory';

const { updateEmbeddings } = useMemory();

// Update embeddings for existing content
await updateEmbeddings.mutateAsync();
```

### Component Integration

```typescript
import MemorySearch from '@/components/MemorySearch';
import MemoryTab from '@/components/MemoryTab';
import MemorySidebar from '@/components/MemorySidebar';

// Full memory interface
<MemoryTab />

// Search-only interface
<MemorySearch />

// Sidebar for quick access
<MemorySidebar isOpen={isOpen} onClose={onClose} />
```

## 📊 Monitoring

### Check Memory Health

```sql
-- Check embedding count
SELECT COUNT(*) FROM memory_embeddings WHERE embedding IS NOT NULL;

-- Check search performance
SELECT 
  AVG(search_duration_ms) as avg_duration,
  COUNT(*) as total_searches
FROM memory_search_logs;
```

### View Search Logs

```sql
-- Recent searches
SELECT 
  query_text,
  results_count,
  search_duration_ms,
  created_at
FROM memory_search_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🔍 Troubleshooting

### Common Issues

1. **pgvector extension not available**
   ```bash
   # Check if extension is enabled
   SELECT * FROM pg_extension WHERE extname = 'vector';
   ```

2. **OpenAI API errors**
   - Verify your API key is correct
   - Check API key permissions
   - Ensure you have sufficient credits

3. **Slow search performance**
   - Check if embeddings are properly indexed
   - Verify the IVFFlat index is created
   - Consider adjusting similarity threshold

4. **No search results**
   - Check if embeddings exist for your content
   - Try lowering the similarity threshold
   - Verify content is being indexed automatically

### Debug Commands

```bash
# Check function logs
npx supabase functions logs memory

# Test function locally
npx supabase functions serve memory

# Check database connection
npx supabase db reset
```

## 🚀 Performance Optimization

### Database Indexes

The migration creates optimized indexes:
- `idx_memory_embeddings_embedding` - IVFFlat index for similarity search
- `idx_memory_embeddings_user_id` - User-specific queries
- `idx_memory_embeddings_content_type` - Content type filtering

### Embedding Updates

- Process embeddings in batches of 50
- Use exponential backoff for API rate limits
- Cache embeddings to avoid regeneration

### Search Optimization

- Use appropriate similarity thresholds (0.7-0.9)
- Limit results to 10-20 for best performance
- Consider content type filtering for specific searches

## 🔒 Security

### Row Level Security

All memory tables have RLS enabled:
- Users can only access their own data
- Search logs are user-specific
- Embeddings are isolated per user

### API Security

- JWT authentication required
- Rate limiting on OpenAI API calls
- Input validation and sanitization

## 📈 Scaling

### For Large Datasets

- Consider partitioning by user_id
- Implement embedding compression
- Use approximate nearest neighbor search
- Cache frequent search results

### Monitoring

- Track embedding generation time
- Monitor search performance
- Alert on API rate limits
- Log search quality metrics

## 🎉 Next Steps

After setup, you can:

1. **Test the system** with sample queries
2. **Customize the UI** components for your needs
3. **Add more content types** (notes, decisions, etc.)
4. **Implement advanced features** like memory consolidation
5. **Add analytics** for usage insights

## 📚 Additional Resources

- [Supabase pgvector Documentation](https://supabase.com/docs/guides/ai/vector-embeddings)
- [OpenAI Embeddings API](https://platform.openai.com/docs/guides/embeddings)
- [Vector Similarity Search](https://en.wikipedia.org/wiki/Vector_similarity_search)

## 🤝 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Supabase function logs
3. Verify database migrations applied correctly
4. Test with a simple query first

For additional help, refer to the TaskMind documentation or create an issue in the repository. 