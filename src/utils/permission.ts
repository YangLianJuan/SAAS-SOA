export const hasAnyRole = (userRoles: string[], requiredRoles?: string[]) => {
  if (!requiredRoles || requiredRoles.length === 0) return true
  return requiredRoles.some((r) => userRoles.includes(r))
}

