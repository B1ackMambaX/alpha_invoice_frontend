import { baseApi } from "@shared/api";
import type { CounterpartyListResponse } from "./model/types";

const counterpartyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCounterparties: build.query<CounterpartyListResponse, void>({
      query: () => ({
        url: "/counterparties",
        params: { page: 1, page_size: 20 },
      }),
    }),
  }),
});

export const { useGetCounterpartiesQuery } = counterpartyApi;
