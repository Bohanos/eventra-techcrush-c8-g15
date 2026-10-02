// This should be swapped when the backend hands over a real base URL.
export const API_BASE_URL = 'https://api.eventra.example.com';

// Flip to false once real endpoints exist — everything already
// routes through the services layer, so this is the only switch
// to touch to toggle between mock and real API calls.
export const USE_MOCK = true;

// Artificial delay (ms) so mock calls feel like real network requests.
export const MOCK_DELAY = 700;

export const STORAGE_KEYS = {
  token: 'eventra_auth_token',
  user: 'eventra_user',
};