export type InvoiceStatus =
  | "draft"
  | "review"
  | "approved"
  | "sent"
  | "cancelled"
  | "error";

export interface InvoiceListItem {
  id: string;
  number: string;
  invoice_date: string;
  status: InvoiceStatus;
  total_amount: string;
  vat_amount: string;
  total_with_vat: string;
  service_name: string | null;
  counterparty_id: string | null;
  branch_id: string | null;
  created_at: string;
}

export interface InvoiceDetail {
  id: string;
  number: string;
  invoice_date: string;
  status: InvoiceStatus;
  currency_code: string;
  total_amount: string;
  vat_amount: string;
  total_with_vat: string;
  service_code: string | null;
  service_name: string | null;
  vat_rate: string | null;
  unit_name: string | null;
  quantity: string | null;
  price: string | null;
  country_code: string | null;
  special_sales_book: boolean;
  inter_price_difference: boolean;
  correction_number: string | null;
  payment_document_number: string | null;
  sent_at: string | null;
  payment_date: string | null;
  counterparty_id: string | null;
  branch_id: string | null;
  regional_center_id: string | null;
  confirmed_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceListResponse {
  items: InvoiceListItem[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface InvoiceFilters {
  status?: string;
  branch_id?: string;
  counterparty_id?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: "ASC" | "DESC";
}

export interface InvoiceUpdate {
  counterparty_id?: string | null;
  service_name?: string | null;
  service_code?: string | null;
  unit_name?: string | null;
  quantity?: number | null;
  price?: number | null;
  vat_rate?: number | null;
  special_sales_book?: boolean | null;
  inter_price_difference?: boolean | null;
  correction_number?: string | null;
  payment_document_number?: string | null;
  payment_date?: string | null;
}
