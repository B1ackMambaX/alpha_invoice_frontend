import { baseApi } from '@shared/api';
import type { ExportParams } from './model/types';

const reportApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    exportInvoiceRegistry: build.query<Blob, ExportParams>({
      query: (params) => ({
        url: '/invoices/export/excel',
        params,
        responseHandler: (response) => response.blob(),
        cache: 'no-cache',
      }),
    }),

    exportSalesBook: build.query<Blob, ExportParams>({
      query: (params) => ({
        url: '/reports/sales-book/excel',
        params,
        responseHandler: (response) => response.blob(),
        cache: 'no-cache',
      }),
    }),
  }),
});

export const {
  useLazyExportInvoiceRegistryQuery,
  useLazyExportSalesBookQuery,
} = reportApi;
