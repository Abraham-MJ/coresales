// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://nextcorenow.com/api',
  DOMAIN_URL: 'https://nextcorenow.com',  // Para imágenes y assets
  TIMEOUT: 30000,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: '@coresales:token',
  WORKSPACE_ID: '@coresales:workspace_id',
  USER_ID: '@coresales:user_id',
  SALES_REP_ID: '@coresales:sales_rep_id',
  USER_DATA: '@coresales:user_data',
} as const;

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
  },
  SALES_REPS: {
    ME: '/sales-reps/me',
    DASHBOARD: '/sales-reps/me/dashboard',
  },
  LEADS: {
    BASE: '/leads',
    BY_ID: (id: string) => `/leads/${id}`,
  },
  CLIENTS: {
    BASE: '/clients',
    BY_DOCUMENT: '/clients/by-document',
  },
  CONTRACTS: {
    BASE: '/contracts',
  },
  SALES: {
    BASE: '/sales',
  },
} as const;
