import { baseApi } from "@shared/api";
import type {
  VatAccountItem,
  VatAccountListResponse,
  VatAccountFilters,
  VatAccountCreate,
  VatAccountUpdate,
} from "./model/types";

const vatAccountApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVatAccounts: build.infiniteQuery<
      VatAccountListResponse,
      VatAccountFilters,
      number
    >({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) =>
          lastPageParam < lastPage.pages ? lastPageParam + 1 : undefined,
      },
      query: ({ pageParam, queryArg }) => ({
        url: "/references/vat-accounts",
        params: {
          page: pageParam,
          page_size: 20,
          ...(queryArg.regional_center_id && {
            regional_center_id: queryArg.regional_center_id,
          }),
          ...(queryArg.branch_id && { branch_id: queryArg.branch_id }),
          ...(queryArg.account_number && {
            account_number: queryArg.account_number,
          }),
          ...(queryArg.sort_by && { sort_by: queryArg.sort_by }),
          ...(queryArg.sort_order && { sort_order: queryArg.sort_order }),
        },
      }),
    }),

    createVatAccount: build.mutation<VatAccountItem, VatAccountCreate>({
      query: (body) => ({
        url: "/references/vat-accounts",
        method: "POST",
        body,
      }),
    }),

    updateVatAccount: build.mutation<
      VatAccountItem,
      { id: string; data: VatAccountUpdate }
    >({
      query: ({ id, data }) => ({
        url: `/references/vat-accounts/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteVatAccount: build.mutation<void, string>({
      query: (id) => ({
        url: `/references/vat-accounts/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetVatAccountsInfiniteQuery,
  useCreateVatAccountMutation,
  useUpdateVatAccountMutation,
  useDeleteVatAccountMutation,
} = vatAccountApi;
