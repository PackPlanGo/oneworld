const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const params = new URLSearchParams(event.body);
  const email = params.get('email');

  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email required' }) };
  }

  const postData = 'fields%5Bemail%5D=' + encodeURIComponent(email) + '&ml-submit=1&anticsrf=true';

  return new Promise((resolve) => {
    const options = {
      hostname: 'assets.mailerlite.com',
      path: '/jsonp/2373720/forms/188256722595349681/subscribe',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Origin': 'https://www.packplango.com',
        'Referer': 'https://www.packplango.com/travel/',
        'User-Agent': 'Mozilla/5.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        // Return the actual ML response so we can debug
        resolve({
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true, ml_status: res.statusCode, ml_response: data })
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: err.message })
      });
    });

    req.write(postData);
    req.end();
  });
};
