import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { baseApi } from '@shared/api'
import type { SessionState, User } from './types'

const TOKEN_KEY = 'auth_token'

const initialState: SessionState = {
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem(TOKEN_KEY, action.payload)
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem(TOKEN_KEY)
    },
  },
})

export const { setToken, setUser, logout } = sessionSlice.actions

export const logoutUser = createAsyncThunk('session/logoutUser', (_, { dispatch }) => {
  dispatch(logout())
  dispatch(baseApi.util.resetApiState())
})
