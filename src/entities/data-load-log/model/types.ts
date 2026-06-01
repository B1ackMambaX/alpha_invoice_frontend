export enum LoadType {
  STANDARD = "standard",
  BY_DATE = "by_date",
  BY_ACCOUNT = "by_account",
}
export enum LoadStatus {
  IN_PROGRESS = "in_progress",
  SUCCESS = "success",
  ERROR = "error",
}

export enum LoadPeriod {
  HOUR = "hour",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  THREE_MONTHS = "three_months",
}

export interface DataLoadLogItem {
  id: string;
  load_type: LoadType;
  status: LoadStatus;
  period_start: string | null;
  period_end: string | null;
  account_number: string | null;
  username: string | null;
  records_loaded: number;
  error_code: number;
  error_message: string | null;
  started_at: string;
  finished_at: string | null;
}

export interface DataLoadLogListResponse {
  items: DataLoadLogItem[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface DataLoadLogFilters {
  period?: LoadPeriod;
  status?: LoadStatus;
  load_type?: LoadType;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}
