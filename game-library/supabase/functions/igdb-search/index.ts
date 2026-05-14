// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const clientId = Deno.env.get("IGDB_CLIENT_ID");
const clientSecret = Deno.env.get("IGDB_CLIENT_SECRET");
const tokenParams = new URLSearchParams({

  client_id: clientId,
  client_secret: clientSecret,
  grant_type: "client_credentials"

});

const tokenURL = `https://id.twitch.tv/oauth2/token?${tokenParams.toString()}`;

Deno.serve(async (req) => {
console.log("FUNCTION TRIGGERED");
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
  
    const { searchTerm } = await req.json()
    console.log("SEARCH TERM RECEIVED:", searchTerm);

    const tokenResponse = await fetch(tokenURL, {method: 'POST'});

    console.log("Twitch Status:", tokenResponse.status);

    if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error("Twitch Error:", errorText); 
      }
    const tokenData = await tokenResponse.json();


    const accessToken = tokenData.access_token;


  const igdbResponse = await fetch("https://api.igdb.com/v4/games", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Client-ID': clientId,
          'Authorization': `Bearer ${accessToken}`,
        },
        body: `search "${searchTerm}"; fields name, cover.url, summary, rating; where cover != null; limit 20;`
    });

    const games = await igdbResponse.json();

    return new Response(
      JSON.stringify(games),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      },
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
