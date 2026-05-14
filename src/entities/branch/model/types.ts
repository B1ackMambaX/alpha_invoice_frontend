export interface BranchItem {
  id: string;
  code: string;
  name: string;
  address: string | null;
  inn: string | null;
  kpp: string | null;
  regional_center_id: string;
  created_at: string;
}

export interface BranchFilters {
  regional_center_id?: string;
}

export interface BranchCreate {
  code: string;
  name: string;
  address?: string;
  inn?: string;
  kpp?: string;
  regional_center_id: string;
}
