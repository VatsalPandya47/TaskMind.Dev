import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

async function ensureTrelloTokensTable(supabase: any) {
  console.log('Ensuring trello_tokens table exists...');
  
  try {
    // Try to create the table if it doesn't exist
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.trello_tokens (
          id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users NOT NULL,
          api_key TEXT NOT NULL,
          token TEXT NOT NULL,
          username TEXT,
          full_name TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );
        
        ALTER TABLE public.trello_tokens ENABLE ROW LEVEL SECURITY;
        
        CREATE INDEX IF NOT EXISTS trello_tokens_user_id_idx ON public.trello_tokens USING btree (user_id);
        
        DROP POLICY IF EXISTS "Users can view their own trello tokens" ON public.trello_tokens;
        CREATE POLICY "Users can view their own trello tokens" 
          ON public.trello_tokens 
          FOR SELECT 
          USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can create their own trello tokens" ON public.trello_tokens;
        CREATE POLICY "Users can create their own trello tokens" 
          ON public.trello_tokens 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can update their own trello tokens" ON public.trello_tokens;
        CREATE POLICY "Users can update their own trello tokens" 
          ON public.trello_tokens 
          FOR UPDATE 
          USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can delete their own trello tokens" ON public.trello_tokens;
        CREATE POLICY "Users can delete their own trello tokens" 
          ON public.trello_tokens 
          FOR DELETE 
          USING (auth.uid() = user_id);
        
        GRANT ALL ON public.trello_tokens TO authenticated;
        GRANT ALL ON public.trello_tokens TO service_role;
      `
    });
    
    if (createError) {
      console.log('Table creation via rpc failed:', createError);
      // Continue anyway - table might already exist
    } else {
      console.log('Table creation command executed successfully');
    }
    
  } catch (error) {
    console.log('Table creation error (continuing anyway):', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    // Get user ID from auth header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.log('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated:', user.id);

    // Parse request body
    const { apiKey, trelloToken } = await req.json();

    if (!apiKey || !trelloToken) {
      return new Response(
        JSON.stringify({ error: 'API key and token are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Validating Trello credentials for user:', user.id);

    // Validate credentials by testing the Trello API
    const testResponse = await fetch(`https://api.trello.com/1/members/me?key=${apiKey}&token=${trelloToken}`);
    
    if (!testResponse.ok) {
      console.error('Trello API validation failed:', testResponse.status);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Trello credentials',
          details: 'Unable to authenticate with Trello API'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const trelloUser = await testResponse.json();
    console.log('Trello credentials validated for user:', trelloUser.username);

    // Ensure table exists before proceeding
    await ensureTrelloTokensTable(supabase);

    // Delete existing token for this user
    const { error: deleteError } = await supabase
      .from('trello_tokens')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Failed to delete existing token:', deleteError);
      
      // If the error is about missing table, try to create it and retry
      if (deleteError.message?.includes('relation') || deleteError.message?.includes('does not exist')) {
        console.log('Table appears to be missing, ensuring it exists...');
        await ensureTrelloTokensTable(supabase);
        
        // Retry the delete
        const { error: retryDeleteError } = await supabase
          .from('trello_tokens')
          .delete()
          .eq('user_id', user.id);
          
        if (retryDeleteError) {
          console.error('Retry delete also failed:', retryDeleteError);
        }
      }
    }

    // Save new credentials
    const { error: insertError } = await supabase
      .from('trello_tokens')
      .insert({
        user_id: user.id,
        api_key: apiKey,
        token: trelloToken,
        username: trelloUser.username || null,
        full_name: trelloUser.fullName || null,
      });

    if (insertError) {
      console.error('Failed to save credentials:', insertError);
      
      // If this also fails due to missing table, try one more time
      if (insertError.message?.includes('relation') || insertError.message?.includes('does not exist')) {
        console.log('Insert failed due to missing table, creating table and retrying...');
        await ensureTrelloTokensTable(supabase);
        
        // Wait a moment for table creation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Retry the insert
        const { error: retryInsertError } = await supabase
          .from('trello_tokens')
          .insert({
            user_id: user.id,
            api_key: apiKey,
            token: trelloToken,
            username: trelloUser.username || null,
            full_name: trelloUser.fullName || null,
          });
          
        if (retryInsertError) {
          console.error('Retry insert also failed:', retryInsertError);
          return new Response(
            JSON.stringify({ 
              error: 'Failed to save credentials after table creation',
              details: retryInsertError.message
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ 
            error: 'Failed to save credentials',
            details: insertError.message
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    console.log('Trello credentials saved successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Trello account connected successfully',
        username: trelloUser.username,
        fullName: trelloUser.fullName
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Save Trello auth error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to save Trello credentials',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 