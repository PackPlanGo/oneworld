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
        'Referer': 'https://www.packplango.com/travel/'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true })
        });
      });
    });

    req.on('error', () => {
      resolve({
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true })
      });
    });

    req.write(postData);
    req.end();
  });
};
