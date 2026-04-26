import { baseApi } from "@shared/api";
import type { RegionalCenterItem } from "./model/types";

const regionalCenterApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRegionalCenters: build.query<RegionalCenterItem[], void>({
      query: () => ({ url: "/references/regional-centers" }),
    }),
  }),
});

export const { useGetRegionalCentersQuery } = regionalCenterApi;
