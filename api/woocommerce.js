export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint, namespace = 'wc/v3', ...params } = req.query;

  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

  const consumerKey = process.env.VITE_WC_CONSUMER_KEY;
  const consumerSecret = process.env.VITE_WC_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    return res.status(500).json({ error: 'WooCommerce credentials not configured' });
  }

  try {
    // ✅ يدعم wc/v3 و wp/v2 و أي namespace تاني
    const url = new URL(`https://building-station.com/wp-json/${namespace}/${endpoint}`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') url.searchParams.append(key, value);
    });

    let body = undefined;
    if (req.method === 'POST' && req.body) {
      body = JSON.stringify(req.body);
    }

    const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const response = await fetch(url.toString(), {
      method: req.method,
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.json();

    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
