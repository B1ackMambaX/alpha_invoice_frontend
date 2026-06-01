import { baseApi } from "@shared/api";
import type {
  ResponsibleItem,
  ResponsibleListResponse,
  ResponsibleFilters,
  ResponsibleCreate,
  ResponsibleUpdate,
} from "./model/types";

const responsibleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getResponsibles: build.infiniteQuery<
      ResponsibleListResponse,
      ResponsibleFilters,
      number
    >({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) =>
          lastPageParam < lastPage.pages ? lastPageParam + 1 : undefined,
      },
      query: ({ pageParam, queryArg }) => ({
        url: "/references/responsibles",
        params: {
          page: pageParam,
          page_size: 20,
          ...(queryArg.regional_center_id && {
            regional_center_id: queryArg.regional_center_id,
          }),
          ...(queryArg.username && { username: queryArg.username }),
          ...(queryArg.sort_by && { sort_by: queryArg.sort_by }),
          ...(queryArg.sort_order && { sort_order: queryArg.sort_order }),
        },
      }),
    }),

    createResponsible: build.mutation<ResponsibleItem, ResponsibleCreate>({
      query: (body) => ({
        url: "/references/responsibles",
        method: "POST",
        body,
      }),
    }),

    updateResponsible: build.mutation<
      ResponsibleItem,
      { id: string; data: ResponsibleUpdate }
    >({
      query: ({ id, data }) => ({
        url: `/references/responsibles/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteResponsible: build.mutation<void, string>({
      query: (id) => ({
        url: `/references/responsibles/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetResponsiblesInfiniteQuery,
  useCreateResponsibleMutation,
  useUpdateResponsibleMutation,
  useDeleteResponsibleMutation,
} = responsibleApi;
