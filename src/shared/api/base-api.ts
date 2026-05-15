import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_URL } from '@shared/config'

interface StateWithSession {
  session: { token: string | null }
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as StateWithSession).session?.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Invoice'],
  endpoints: () => ({}),
})
