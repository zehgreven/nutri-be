export interface Paging {
  page: number;
  limit: number;
}

export type Paginated<T> = {
  result: T[];
  page: number;
  previousPage: number | undefined;
  nextPage: number | undefined;
  totalPages: number;
  limit: number;
  count: number;
};
