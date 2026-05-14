export interface VatAccountItem {
  id: string;
  account_number: string;
  name: string;
  regional_center_id: string;
  branch_id: string;
  created_at: string;
}

export interface VatAccountListResponse {
  items: VatAccountItem[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface VatAccountFilters {
  regional_center_id?: string;
  branch_id?: string;
  account_number?: string;
}

export interface VatAccountCreate {
  account_number: string;
  name: string;
  regional_center_id: string;
  branch_id: string;
}

export interface VatAccountUpdate {
  account_number?: string;
  name?: string;
  regional_center_id?: string;
  branch_id?: string;
}
