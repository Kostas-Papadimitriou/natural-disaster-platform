export const isAdminUser = (user) => {
  const roles = user?.realm_access?.roles || [];
  return roles.includes("admin");
};