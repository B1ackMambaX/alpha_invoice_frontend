import { baseApi } from '@shared/api'
import { sessionSlice } from './model/session.slice'
import type { LoginRequest, RegisterRequest, TokenResponse, User } from './model/types'

const sessionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<TokenResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        dispatch(sessionSlice.actions.setToken(data.access_token))
      },
    }),

    register: build.mutation<User, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    getMe: build.query<User, void>({
      query: () => '/auth/me',
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        dispatch(sessionSlice.actions.setUser(data))
      },
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = sessionApi
