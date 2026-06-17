export interface Role {
  id: string
  name: string
}

export interface User {
  id: string
  email: string | null
  username: string
  full_name: string
  is_active: boolean
  roles: Role[]
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  full_name: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface SessionState {
  token: string | null
  user: User | null
}
