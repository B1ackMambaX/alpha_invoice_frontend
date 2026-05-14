import { baseApi } from "@shared/api";
import type { UserItem } from "./model/types";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UserItem[], void>({
      query: () => ({ url: "/auth/users" }),
    }),
  }),
});

export const { useGetUsersQuery } = userApi;
