export type { User, Role, SessionState } from './model/types'
export { sessionSlice, logout, setToken, setUser } from './model/session.slice'
export { useLoginMutation, useRegisterMutation, useGetMeQuery } from './api'
export { canManageInvoices, hasAnyRole, isAccountant, isAdmin } from './lib/permissions'
