import { baseApi } from "@shared/api";
import type {
  DataLoadLogItem,
  DataLoadLogListResponse,
  DataLoadLogFilters,
} from "./model/types";

const dataLoadLogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDataLoadLog: build.infiniteQuery<
      DataLoadLogListResponse,
      DataLoadLogFilters,
      number
    >({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) =>
          lastPageParam < lastPage.pages ? lastPageParam + 1 : undefined,
      },
      query: ({ pageParam, queryArg }) => ({
        url: "/data-load/log",
        params: {
          page: pageParam,
          page_size: 20,
          ...(queryArg.period && { period: queryArg.period }),
          ...(queryArg.status && { status: queryArg.status }),
          ...(queryArg.load_type && { load_type: queryArg.load_type }),
          ...(queryArg.sort_by && { sort_by: queryArg.sort_by }),
          ...(queryArg.sort_order && { sort_order: queryArg.sort_order }),
        },
      }),
    }),

    createStandardLoad: build.mutation<DataLoadLogItem, void>({
      query: () => ({ url: "/data-load/standard", method: "POST", body: {} }),
    }),

    createByDateLoad: build.mutation<DataLoadLogItem, { load_date: string }>({
      query: (body) => ({ url: "/data-load/by-date", method: "POST", body }),
    }),

    createByAccountLoad: build.mutation<
      DataLoadLogItem,
      { account_number: string; date_from: string }
    >({
      query: (body) => ({ url: "/data-load/by-account", method: "POST", body }),
    }),
  }),
});

export const {
  useGetDataLoadLogInfiniteQuery,
  useCreateStandardLoadMutation,
  useCreateByDateLoadMutation,
  useCreateByAccountLoadMutation,
} = dataLoadLogApi;
