// API Response Types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// HTTP Error Response
export interface ApiError {
  status: 'error';
  message: string;
  data: null;
}
