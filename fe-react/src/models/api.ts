/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
  data: T | null;
  error: boolean;
  message: string | null;
}

export interface Paginated<T = any> {
  limit: number;
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}

export interface FetchPayload {
  page?: number;
  limit?: number;
  search?: string;
  populate?: string;
  sortBy?: string;
  projectBy?: string;
}

export interface PaginationPayload {
  page?: number;
  limit?: number;
}
