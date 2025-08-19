
export const WC_BASE_URL = 'https://building-station.com/wp-json/wc/v3';
export const CONSUMER_KEY = 'ck_668bb44e4c0f02715c80f73464b92f44134099c7';
export const CONSUMER_SECRET = 'cs_533cd7f7590a9b313ef7f6421517b81f453cca8d';

// Create Basic Auth header
export const createAuthHeader = () => {
  const credentials = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
  return `Basic ${credentials}`;
};
