import { baseApi } from "@shared/api";
import type { BranchItem, BranchFilters, BranchCreate } from "./model/types";

const branchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBranches: build.query<BranchItem[], BranchFilters>({
      query: (filters) => ({
        url: "/references/branches",
        params: {
          ...(filters.regional_center_id && {
            regional_center_id: filters.regional_center_id,
          }),
        },
      }),
    }),

    createBranch: build.mutation<BranchItem, BranchCreate>({
      query: (body) => ({
        url: "/references/branches",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetBranchesQuery, useCreateBranchMutation } = branchApi;
