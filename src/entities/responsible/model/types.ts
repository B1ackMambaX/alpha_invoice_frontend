export interface ResponsibleItem {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  department: string | null;
  regional_center_id: string;
  created_at: string;
}

export interface ResponsibleListResponse {
  items: ResponsibleItem[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface ResponsibleFilters {
  regional_center_id?: string;
  username?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface ResponsibleCreate {
  user_id: string;
  regional_center_id: string;
  department?: string;
}

export interface ResponsibleUpdate {
  user_id?: string;
  regional_center_id?: string;
  department?: string | null;
}
