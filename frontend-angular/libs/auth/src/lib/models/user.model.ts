/**
 * User model and authentication types
 */

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'waiter' | 'cashier' | 'kitchen';
  scopes: string[];
  pin?: string; // Only for display purposes in dev mode
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PinLoginRequest {
  pin: string;
}

export interface PinLoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
