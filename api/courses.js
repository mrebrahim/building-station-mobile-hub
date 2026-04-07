export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint = 'courses', ...params } = req.query;

  const consumerKey = process.env.VITE_WC_CONSUMER_KEY;
  const consumerSecret = process.env.VITE_WC_CONSUMER_SECRET;
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    // ✅ جرّب LearnDash أو TutorLMS أو WooCommerce Products بـ category الكورسات
    const attempts = [
      // LearnDash
      `https://building-station.com/wp-json/ldlms/v2/${endpoint}`,
      // TutorLMS
      `https://building-station.com/wp-json/tutor/v1/${endpoint}`,
      // WordPress Custom Post Type
      `https://building-station.com/wp-json/wp/v2/${endpoint}`,
      // WooCommerce category الدورات التعليمية (id=110)
      `https://building-station.com/wp-json/wc/v3/products?category=110&per_page=20&status=publish`,
    ];

    // لو endpoint محدد جرّبه أولاً
    const url = new URL(attempts[2]);
    Object.entries(params).forEach(([k, v]) => { if (v) url.searchParams.append(k, v); });

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json(data);
    }

    // Fallback: WooCommerce products في category الدورات
    const wcUrl = new URL(`https://building-station.com/wp-json/wc/v3/products`);
    wcUrl.searchParams.append('category', '110');
    wcUrl.searchParams.append('per_page', '20');
    wcUrl.searchParams.append('status', 'publish');
    Object.entries(params).forEach(([k, v]) => { if (v && k !== 'endpoint') wcUrl.searchParams.append(k, v); });

    const wcResponse = await fetch(wcUrl.toString(), {
      headers: { 'Authorization': `Basic ${credentials}`, 'Content-Type': 'application/json' }
    });

    const wcData = await wcResponse.json();
    return res.status(wcResponse.ok ? 200 : wcResponse.status).json(wcData);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
