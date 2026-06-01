import { baseApi } from "@shared/api";
import type {
  InvoiceListItem,
  InvoiceListResponse,
  InvoiceFilters,
  InvoiceDetail,
  InvoiceUpdate,
} from "./model/types";

const invoiceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getInvoices: build.infiniteQuery<InvoiceListResponse, InvoiceFilters, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) =>
          lastPageParam < lastPage.pages ? lastPageParam + 1 : undefined,
      },
      query: ({ pageParam, queryArg }) => ({
        url: "/invoices",
        params: {
          page: pageParam,
          page_size: 20,
          ...(queryArg.status && { status: queryArg.status }),
          ...(queryArg.branch_id && { branch_id: queryArg.branch_id }),
          ...(queryArg.counterparty_id && { counterparty_id: queryArg.counterparty_id }),
          ...(queryArg.date_from && { date_from: queryArg.date_from }),
          ...(queryArg.date_to && { date_to: queryArg.date_to }),
          ...(queryArg.sort_by && { sort_by: queryArg.sort_by }),
          ...(queryArg.sort_order && { sort_order: queryArg.sort_order }),
        },
      }),
      providesTags: ['Invoice'],
    }),

    getInvoice: build.query<InvoiceDetail, string>({
      query: (id) => ({ url: `/invoices/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'Invoice' as const, id }],
    }),

    updateInvoice: build.mutation<InvoiceDetail, { id: string; data: InvoiceUpdate }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Invoice' as const, id }, 'Invoice'],
    }),

    approveInvoice: build.mutation<InvoiceListItem, string>({
      query: (id) => ({
        url: `/invoices/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Invoice' as const, id }, 'Invoice'],
    }),

    returnInvoiceToDraft: build.mutation<InvoiceListItem, string>({
      query: (id) => ({
        url: `/invoices/${id}/return-to-draft`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Invoice' as const, id }, 'Invoice'],
    }),
  }),
});

export const {
  useGetInvoicesInfiniteQuery,
  useGetInvoiceQuery,
  useUpdateInvoiceMutation,
  useApproveInvoiceMutation,
  useReturnInvoiceToDraftMutation,
} = invoiceApi;
