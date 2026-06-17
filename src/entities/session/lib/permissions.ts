import type { User } from "../model/types"

const ROLE_ALIASES: Record<string, string> = {
  "админ": "admin",
  admin: "admin",
  "бухгалтер": "accountant",
  accountant: "accountant",
  "сотрудник факторинга": "factoring",
  "факторинг": "factoring",
  factoring: "factoring",
  "сотрудник эквайринга": "acquiring",
  "эквайринг": "acquiring",
  acquiring: "acquiring",
}

const normalizeRoleName = (name: string) => {
  const normalized = name.trim().toLowerCase()
  return ROLE_ALIASES[normalized] ?? normalized
}

export const getRoleCodes = (user: User | null) =>
  new Set((user?.roles ?? []).map((role) => normalizeRoleName(role.name)))

export const hasAnyRole = (user: User | null, roles: string[]) => {
  const userRoles = getRoleCodes(user)
  return roles.some((role) => userRoles.has(normalizeRoleName(role)))
}

export const isAdmin = (user: User | null) => hasAnyRole(user, ["admin"])

export const isAccountant = (user: User | null) =>
  hasAnyRole(user, ["accountant"])

export const canManageInvoices = (user: User | null) =>
  hasAnyRole(user, ["admin", "accountant"])
