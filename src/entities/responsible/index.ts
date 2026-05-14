export type {
  ResponsibleItem,
  ResponsibleListResponse,
  ResponsibleFilters,
  ResponsibleCreate,
  ResponsibleUpdate,
} from "./model/types";
export {
  useGetResponsiblesInfiniteQuery,
  useCreateResponsibleMutation,
  useUpdateResponsibleMutation,
  useDeleteResponsibleMutation,
} from "./api";
