
export const WC_BASE_URL = 'https://building-station.com/wp-json/wc/v3';
export const CONSUMER_KEY = 'ck_cd0cb2feaca27a3c317b1c1d33689f29e0d15029';
export const CONSUMER_SECRET = 'cs_378a4cbddf6425f9e88d1d32bdb47fac18cf27d3';

// Create Basic Auth header
export const createAuthHeader = () => {
  const credentials = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
  return `Basic ${credentials}`;
};
