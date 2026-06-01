import { baseApi } from "@shared/api";
import type {
  IncomeAccountItem,
  IncomeAccountListResponse,
  IncomeAccountFilters,
  IncomeAccountCreate,
  IncomeAccountUpdate,
} from "./model/types";

const incomeAccountApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getIncomeAccounts: build.infiniteQuery<
      IncomeAccountListResponse,
      IncomeAccountFilters,
      number
    >({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) =>
          lastPageParam < lastPage.pages ? lastPageParam + 1 : undefined,
      },
      query: ({ pageParam, queryArg }) => ({
        url: "/references/income-accounts",
        params: {
          page: pageParam,
          page_size: 20,
          ...(queryArg.regional_center_id && { regional_center_id: queryArg.regional_center_id }),
          ...(queryArg.branch_id && { branch_id: queryArg.branch_id }),
          ...(queryArg.account_number && { account_number: queryArg.account_number }),
          ...(queryArg.sort_by && { sort_by: queryArg.sort_by }),
          ...(queryArg.sort_order && { sort_order: queryArg.sort_order }),
        },
      }),
    }),

    createIncomeAccount: build.mutation<IncomeAccountItem, IncomeAccountCreate>({
      query: (body) => ({
        url: "/references/income-accounts",
        method: "POST",
        body,
      }),
    }),

    updateIncomeAccount: build.mutation<
      IncomeAccountItem,
      { id: string; data: IncomeAccountUpdate }
    >({
      query: ({ id, data }) => ({
        url: `/references/income-accounts/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteIncomeAccount: build.mutation<void, string>({
      query: (id) => ({
        url: `/references/income-accounts/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetIncomeAccountsInfiniteQuery,
  useCreateIncomeAccountMutation,
  useUpdateIncomeAccountMutation,
  useDeleteIncomeAccountMutation,
} = incomeAccountApi;
