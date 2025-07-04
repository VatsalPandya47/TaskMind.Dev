import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  console.log('Create Monday.com item request method:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user ID from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('User authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User authenticated successfully:', user.id);

    // Get Monday.com token from database
    const { data: mondayToken, error: tokenError } = await supabase
      .from('monday_tokens')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (tokenError || !mondayToken) {
      console.error('No Monday.com token found for user:', user.id);
      return new Response(
        JSON.stringify({ error: 'Monday.com not connected' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if token is expired
    if (mondayToken.expires_at && new Date(mondayToken.expires_at) <= new Date()) {
      console.error('Monday.com token expired for user:', user.id);
      return new Response(
        JSON.stringify({ error: 'Monday.com token expired' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get item data from request body
    const { board_id, group_id, item_name, column_values } = await req.json();

    if (!board_id || !item_name) {
      console.error('Missing required fields:', { board_id, item_name });
      return new Response(
        JSON.stringify({ error: 'Board ID and item name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating item in Monday.com board:', { board_id, group_id, item_name });

    // Prepare GraphQL mutation
    let mutation = `
      mutation {
        create_item(
          board_id: ${board_id}
          item_name: "${item_name.replace(/"/g, '\\"')}"
    `;

    // Add group_id if provided
    if (group_id) {
      mutation += `
          group_id: "${group_id}"
      `;
    }

    // Add column values if provided
    if (column_values && Object.keys(column_values).length > 0) {
      const columnValuesJson = JSON.stringify(column_values).replace(/"/g, '\\"');
      mutation += `
          column_values: "${columnValuesJson}"
      `;
    }

    mutation += `
        ) {
          id
          name
          state
          created_at
          updated_at
          board {
            id
            name
          }
          group {
            id
            title
          }
          column_values {
            id
            title
            text
            value
          }
        }
      }
    `;

    // Create item using GraphQL API
    const createResponse = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mondayToken.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation
      })
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.text();
      console.error('Monday.com item creation failed:', {
        status: createResponse.status,
        statusText: createResponse.statusText,
        error: errorData
      });
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create item',
          details: `Monday.com API returned ${createResponse.status}: ${errorData}`
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const createData = await createResponse.json();
    console.log('Item creation response:', createData);

    if (createData.errors) {
      console.error('GraphQL errors:', createData.errors);
      return new Response(
        JSON.stringify({ 
          error: 'GraphQL errors',
          details: createData.errors
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        item: createData.data?.create_item,
        message: 'Item created successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error creating Monday.com item:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create item',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 