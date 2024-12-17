// types/pagination.ts
export interface PaginatedResponse<T> {
    content: T;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }