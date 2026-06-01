import { baseApi } from "@shared/api";
import type { BranchItem, BranchFilters, BranchCreate, BranchUpdate } from "./model/types";

const branchApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBranches: build.query<BranchItem[], BranchFilters>({
      query: (filters) => ({
        url: "/references/branches",
        params: {
          ...(filters.regional_center_id && {
            regional_center_id: filters.regional_center_id,
          }),
          ...(filters.sort_by && { sort_by: filters.sort_by }),
          ...(filters.sort_order && { sort_order: filters.sort_order }),
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

    updateBranch: build.mutation<BranchItem, { id: string; data: BranchUpdate }>({
      query: ({ id, data }) => ({
        url: `/references/branches/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const { useGetBranchesQuery, useCreateBranchMutation, useUpdateBranchMutation } = branchApi;
