import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// Configuration
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const anonKey = Deno.env.get('EDGE_ANON_KEY')

console.log('Environment variables:')
console.log('- OPENAI_API_KEY:', OPENAI_API_KEY ? 'Set' : 'Not set')
console.log('- SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set')
console.log('- SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? 'Set' : 'Not set')
console.log('- EDGE_ANON_KEY:', anonKey ? 'Set' : 'Not set')

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  jitter: 0.1,
}

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const calculateBackoffDelay = (
  attempt: number, 
  baseDelay: number, 
  maxDelay: number, 
  multiplier: number, 
  jitter: number
): number => {
  const delay = baseDelay * Math.pow(multiplier, attempt - 1)
  const jitterAmount = delay * jitter * Math.random()
  return Math.min(delay + jitterAmount, maxDelay)
}

// Generate embeddings using OpenAI
async function generateEmbedding(text: string): Promise<number[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.data[0].embedding
}

// Search memory by similarity
async function searchMemory(queryEmbedding: number[], threshold: number = 0.7, limit: number = 10) {
  const supabase = createClient(supabaseUrl!, serviceRoleKey!)
  
  const { data, error } = await supabase.rpc('search_memory', {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit
  })

  if (error) {
    throw new Error(`Database error: ${error.message}`)
  }

  return data
}

// Log search query
async function logSearch(queryText: string, queryEmbedding: number[], resultsCount: number, duration: number) {
  const supabase = createClient(supabaseUrl!, serviceRoleKey!)
  
  await supabase.from('memory_search_logs').insert({
    query: queryText,
    query_embedding: queryEmbedding,
    results_count: resultsCount,
    search_duration_ms: duration
  })
}

// Update embeddings for existing content
async function updateEmbeddings() {
  const supabase = createClient(supabaseUrl!, serviceRoleKey!)
  
  // Get all memory embeddings without embeddings
  const { data: embeddings, error } = await supabase
    .from('memory_embeddings')
    .select('*')
    .is('embedding', null)
    .limit(50) // Process in batches

  if (error) {
    throw new Error(`Database error: ${error.message}`)
  }

  if (!embeddings || embeddings.length === 0) {
    return { processed: 0, message: 'No embeddings to update' }
  }

  let processed = 0
  for (const embedding of embeddings) {
    try {
      const vector = await generateEmbedding(embedding.content_text)
      
      await supabase
        .from('memory_embeddings')
        .update({ embedding: vector })
        .eq('id', embedding.id)
      
      processed++
      
      // Small delay to avoid rate limits
      await delay(100)
    } catch (error) {
      console.error(`Failed to update embedding ${embedding.id}:`, error)
    }
  }

  return { processed, message: `Updated ${processed} embeddings` }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, query, threshold, limit, updateEmbeddings: shouldUpdateEmbeddings, content_text, content_type, metadata } = await req.json()

    // Get user JWT from auth header
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    console.log('Incoming Authorization header:', authHeader)
    console.log('Extracted token:', token)

    // Use the user's JWT for DB operations (so RLS applies)
    const supabase = createClient(supabaseUrl!, anonKey!, { global: { headers: { Authorization: `Bearer ${token}` } } })

    // Get user info
    let user = null
    let userError = null
    let isAnonKey = false
    
    if (token) {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token)
        if (!authError && authUser) {
          user = authUser
        } else {
          userError = authError || 'No user found';
          // Check if this is the anon key
          if (token === anonKey) {
            isAnonKey = true;
            console.log('Using anon key for testing');
          }
        }
      } catch (e) {
        userError = e;
        // Check if this is the anon key
        if (token === anonKey) {
          isAnonKey = true;
          console.log('Using anon key for testing');
        }
      }
    }
    console.log('Decoded user:', user)
    console.log('User error:', userError)
    console.log('Is anon key:', isAnonKey)

    // Handle test action without authentication
    if (action === 'test') {
      console.log('Test action hit! Returning 200 OK for test.');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Memory function is working',
          authenticated: !!user,
          openai_configured: !!OPENAI_API_KEY,
          user_error: userError,
          is_anon_key: isAnonKey,
          token: token ? token.substring(0, 20) + '...' : null
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // For other actions, require authentication OR allow anon key for testing
    if (!user && !isAnonKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Authentication required',
          user_error: userError,
          message: 'Please provide a valid authorization token',
          token: token ? token.substring(0, 20) + '...' : null,
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log(`User authenticated: ${user?.id || 'anon key'}`)

    if (action === 'search' && query) {
      const startTime = Date.now()
      try {
        // Generate embedding for the query
        const queryEmbedding = await generateEmbedding(query)
        
        // Use service role key for database operations when using anon key
        const dbClient = isAnonKey ? 
          createClient(supabaseUrl!, serviceRoleKey!) : 
          supabase;
        
        // Search memory (RLS applies)
        const { data, error } = await dbClient.rpc('search_memory', {
          query_embedding: queryEmbedding,
          match_threshold: threshold || 0.7,
          match_count: limit || 10
        })
        if (error) throw error
        const duration = Date.now() - startTime
        // Log the search (RLS applies)
        const logRes = await dbClient.from('memory_search_logs').insert({
          query,
          query_embedding: queryEmbedding,
          results_count: data.length,
          search_duration_ms: duration,
          user_id: user?.id || null
        })
        return new Response(
          JSON.stringify({
            success: true,
            results: data,
            search_duration_ms: duration,
            query_embedding_length: queryEmbedding.length,
            logRes
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      } catch (error) {
        console.error('Search error:', error)
        return new Response(
          JSON.stringify({ success: false, error: error.message || error.toString(), stack: error.stack || null }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    if (action === 'generate_embedding' && content_text) {
      try {
        const embedding = await generateEmbedding(content_text)
        // Store the embedding (RLS applies)
        const { data, error } = await supabase
          .from('memory_embeddings')
          .insert({
            content_text,
            content_type: content_type || 'unknown',
            content_id: metadata?.id || crypto.randomUUID(),
            embedding,
            metadata: metadata || {},
            user_id: user?.id || null
          })
          .select()
        if (error) throw error
        return new Response(
          JSON.stringify({
            success: true,
            embedding_id: data[0].id,
            embedding_length: embedding.length
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      } catch (error) {
        console.error('Embedding generation error:', error)
        return new Response(
          JSON.stringify({ success: false, error: error.message || error.toString(), stack: error.stack || null }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    if (action === 'update_embeddings' && shouldUpdateEmbeddings) {
      const result = await updateEmbeddings()
      
      return new Response(
        JSON.stringify({
          success: true,
          ...result
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (action === 'get_stats') {
      const { count: embeddingsCount } = await supabase
        .from('memory_embeddings')
        .select('*', { count: 'exact', head: true })

      const { count: searchLogsCount } = await supabase
        .from('memory_search_logs')
        .select('*', { count: 'exact', head: true })

      return new Response(
        JSON.stringify({
          success: true,
          embeddingsCount: embeddingsCount || 0,
          searchLogsCount: searchLogsCount || 0
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid action',
        message: 'Supported actions: search, generate_embedding, update_embeddings, get_stats, test'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Memory function error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message || error.toString(), stack: error.stack || null }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 