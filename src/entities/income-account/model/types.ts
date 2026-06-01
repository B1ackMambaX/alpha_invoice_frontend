export interface IncomeAccountItem {
  id: string;
  account_number: string;
  name: string;
  regional_center_id: string;
  branch_id: string;
  created_at: string;
}

export interface IncomeAccountListResponse {
  items: IncomeAccountItem[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface IncomeAccountFilters {
  regional_center_id?: string;
  branch_id?: string;
  account_number?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface IncomeAccountCreate {
  account_number: string;
  name: string;
  regional_center_id: string;
  branch_id: string;
}

export interface IncomeAccountUpdate {
  account_number?: string;
  name?: string;
  regional_center_id?: string;
  branch_id?: string;
}
