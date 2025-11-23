/**
 * Production environment configuration
 */

export const environment = {
  production: true,
  apiUrl: '/api/v1',
  socketUrl: window.location.origin,
  enableDebugTools: false,
  logLevel: 'error',
};
