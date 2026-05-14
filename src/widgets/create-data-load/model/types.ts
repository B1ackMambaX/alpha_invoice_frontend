import type { LoadType } from "@entities/data-load-log";

export interface CreateDataLoadFormValues {
  load_type: LoadType;
  load_date?: string;
  account_number?: string;
  date_from?: string;
}
