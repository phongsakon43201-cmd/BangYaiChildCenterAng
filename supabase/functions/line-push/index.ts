// ==========================================================================
// Bang Yai Child Development Center MIS - Supabase Edge Function
// LINE Messaging API Push Serverless Function (Bypasses Browser CORS 100%)
// ==========================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { channelAccessToken, to, messageText } = await req.json()

    if (!channelAccessToken || !to || !messageText) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters (channelAccessToken, to, messageText)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const lineResponse = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${channelAccessToken}`
      },
      body: JSON.stringify({
        to: to,
        messages: [{ type: 'text', text: messageText }]
      })
    })

    const lineData = await lineResponse.text()

    return new Response(
      JSON.stringify({ success: lineResponse.ok, lineResponseStatus: lineResponse.status, result: lineData }),
      { status: lineResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
