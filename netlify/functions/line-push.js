// ==========================================================================
// Netlify Serverless Function - LINE Messaging API Push Relay
// Host Origin: https://child-center-mis.netlify.app/.netlify/functions/line-push
// ==========================================================================

const https = require('https');

exports.handler = async function(event, context) {
  // CORS Headers for browser fetch
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'OK' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const token = body.channelAccessToken || process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const { to, messageText } = body;

    if (!token || !to || !messageText) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing channelAccessToken (or env LINE_CHANNEL_ACCESS_TOKEN), to, or messageText' })
      };
    }

    const payload = JSON.stringify({
      to: to,
      messages: [{ type: 'text', text: messageText }]
    });

    const options = {
      hostname: 'api.line.me',
      path: '/v2/bot/message/push',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const lineResponse = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseBody = '';
        res.on('data', chunk => responseBody += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, body: responseBody }));
      });
      req.on('error', err => reject(err));
      req.write(payload);
      req.end();
    });

    console.log(`[Netlify Line Push] Status: ${lineResponse.statusCode}, Response: ${lineResponse.body}`);

    return {
      statusCode: lineResponse.statusCode,
      headers,
      body: lineResponse.body
    };

  } catch (err) {
    console.error('[Netlify Line Push Error]', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
