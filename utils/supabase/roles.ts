import { createClient } from "./server";

/**
 * Get the current user's role
 * @returns The role object if found, null otherwise
 */
export async function getCurrentUserRole(): Promise<Role | null> {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return null;
  }

  // Get user's role
  const { data: userRole, error: userRoleError } = await supabase
    .from('userRoles')
    .select('*, roles(*)')
    .eq('userUuid', user.id)
    .single();

  if (userRoleError || !userRole) {
    return null;
  }

  return userRole.roles as Role;
}

/**
 * Check if the current user has a specific role
 * @param roleName The name of the role to check for
 * @returns true if the user has the role, false otherwise
 */
export async function hasRole(roleName: string): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role?.name === roleName;
}

/**
 * Check if the current user has any of the specified roles
 * @param roleNames Array of role names to check for
 * @returns true if the user has any of the roles, false otherwise
 */
export async function hasAnyRole(roleNames: string[]): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role ? roleNames.includes(role.name) : false;
} 