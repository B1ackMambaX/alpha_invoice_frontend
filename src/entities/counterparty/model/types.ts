export interface CounterpartyItem {
  id: string;
  inn: string;
  kpp: string | null;
  full_name: string;
  short_name: string | null;
}

export interface CounterpartyListResponse {
  items: CounterpartyItem[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}
