// Personal Brand subscribe handler (separate from the Travel /subscribe function).
// Handles two MailerLite forms:
//   list=freebie   -> "Sichtbarkeit reicht nicht" Guide (email only)
//   list=waitlist  -> Academy Warteliste (email + phone)
//
// SETUP (Jack): create two MailerLite embedded forms/groups and paste their
// numeric form IDs below. The account id 2373720 is the same PackPlanGo account
// already used by the Travel form. The waitlist form must have a Phone field.

const https = require('https');

const ML_ACCOUNT = '2373720';
const FORMS = {
  freebie:  'PLACEHOLDER_FREEBIE_FORM_ID',   // <-- MailerLite form id fuer den Guide
  waitlist: 'PLACEHOLDER_WAITLIST_FORM_ID',  // <-- MailerLite form id fuer die Warteliste (mit Telefon-Feld)
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const params = new URLSearchParams(event.body);
  const list = (params.get('list') || 'freebie').toLowerCase();
  const email = params.get('email');
  const phone = params.get('phone');
  const name = params.get('name');

  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email required' }) };
  }
  const formId = FORMS[list];
  if (!formId || formId.indexOf('PLACEHOLDER') === 0) {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Form id not configured for list: ' + list }) };
  }

  let body = 'fields%5Bemail%5D=' + encodeURIComponent(email);
  if (phone) body += '&fields%5Bphone%5D=' + encodeURIComponent(phone);
  if (name)  body += '&fields%5Bname%5D=' + encodeURIComponent(name);
  body += '&ml-submit=1&anticsrf=true';

  return new Promise((resolve) => {
    const options = {
      hostname: 'assets.mailerlite.com',
      path: '/jsonp/' + ML_ACCOUNT + '/forms/' + formId + '/subscribe',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
        'Origin': 'https://www.packplango.com',
        'Referer': 'https://www.packplango.com/personalbrand/',
        'User-Agent': 'Mozilla/5.0'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        resolve({ statusCode: 200, headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true, list: list, ml_status: res.statusCode, ml_response: data }) });
      });
    });
    req.on('error', (err) => {
      resolve({ statusCode: 200, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: err.message }) });
    });
    req.write(body);
    req.end();
  });
};
