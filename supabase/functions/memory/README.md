# TaskMind Memory Function

A Supabase Edge Function that provides long-term memory capabilities for TaskMind, including vector embeddings and semantic search.

## 🧠 Features

- **Vector Embeddings**: Generate embeddings for meetings, summaries, tasks, and decisions
- **Semantic Search**: Search memory using natural language queries
- **Automatic Indexing**: Automatically creates embeddings when content is created/updated
- **Search Logging**: Track search queries for analytics and improvement

## 🚀 Deployment

```bash
# Deploy the memory function
npx supabase functions deploy memory

# Deploy with environment variables
npx supabase functions deploy memory --env-file .env.local
```

## 📡 API Reference

### Endpoint

```
POST /functions/v1/memory
```

### Request Headers

```http
Authorization: Bearer <user_jwt_token>
Content-Type: application/json
```

### Request Body

#### Search Memory

```typescript
{
  action: "search";
  query: string;           // Natural language search query
  threshold?: number;      // Similarity threshold (0.0-1.0, default: 0.7)
  limit?: number;          // Maximum results (default: 10)
}
```

#### Update Embeddings

```typescript
{
  action: "update_embeddings";
  updateEmbeddings: true;
}
```

#### Generate Embedding

```typescript
{
  action: "generate_embedding";
  query: string;           // Text to generate embedding for
}
```

### Response Format

#### Success Response (200)

```typescript
{
  success: true;
  results?: Array<{
    id: string;
    content_type: "meeting" | "summary" | "task" | "decision" | "note";
    content_id: string;
    content_text: string;
    metadata: Record<string, any>;
    similarity: number;
  }>;
  search_duration_ms?: number;
  query_embedding_length?: number;
  embedding?: number[];
  embedding_length?: number;
  processed?: number;
  message?: string;
}
```

#### Error Response (4xx/5xx)

```typescript
{
  success: false;
  error: string;           // Human-readable error message
}
```

## 🎯 Usage Examples

### Search Memory

```typescript
const response = await fetch('/functions/v1/memory', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'search',
    query: 'What was discussed in my last design meeting?',
    threshold: 0.8,
    limit: 5
  })
});

const data = await response.json();
console.log('Search results:', data.results);
```

### Update Missing Embeddings

```typescript
const response = await fetch('/functions/v1/memory', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    action: 'update_embeddings',
    updateEmbeddings: true
  })
});

const data = await response.json();
console.log('Updated embeddings:', data.processed);
```

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY`: OpenAI API key for generating embeddings
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key

### Database Requirements

- `pgvector` extension enabled
- `memory_embeddings` table with vector column
- `memory_search_logs` table for tracking searches
- `search_memory` function for similarity search

## 📊 Performance

- **Embedding Generation**: ~100-500ms per text chunk
- **Search Response**: ~50-200ms for similarity search
- **Rate Limiting**: Built-in retry logic with exponential backoff
- **Batch Processing**: Processes embeddings in batches of 50

## 🔍 Search Quality

- **Similarity Threshold**: Default 0.7 (70% similarity)
- **Embedding Model**: OpenAI text-embedding-3-small (1536 dimensions)
- **Search Algorithm**: Cosine similarity with IVFFlat index
- **Result Ranking**: Ordered by similarity score (highest first)

## 🛠️ Development

### Local Testing

```bash
# Start Supabase locally
npx supabase start

# Test the function
curl -X POST http://localhost:54321/functions/v1/memory \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"action":"search","query":"test query"}'
```

### Debugging

The function includes comprehensive logging for:
- Authentication status
- API call durations
- Error details
- Search performance metrics

Check the Supabase dashboard logs for detailed debugging information. 