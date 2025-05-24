import { getCurrentUserRole } from "./roles";

// Define available roles and their priorities
export const ROLES = {
  ADMINISTRATOR: {
    name: 'Administrator',
    priority: 0,
  },
  MANAGER: {
    name: 'Manager',
    priority: 1,
  },
  USER: {
    name: 'User',
    priority: 2,
  },
} as const;

// Define page access rules
export const PAGE_ACCESS = {
  // Pages that require specific role priority
  RESTRICTED: {
    minPriority: 0, // Only Administrator (0) can access
  },
  MANAGEMENT: {
    minPriority: 1, // Administrator (0) and Manager (1) can access
  },
  // All other pages are accessible to all roles
  DEFAULT: {
    minPriority: 2, // All roles can access
  },
} as const;

/**
 * Check if the current user can access a specific page
 * @param pageKey The key of the page to check access for
 * @returns true if the user can access the page, false otherwise
 */
export async function canAccessPage(pageKey: keyof typeof PAGE_ACCESS): Promise<boolean> {
  const role = await getCurrentUserRole();
  if (!role) return false;

  const pageRule = PAGE_ACCESS[pageKey] || PAGE_ACCESS.DEFAULT;
  return role.prority <= pageRule.minPriority;
}

/**
 * Get all pages that the current user can access
 * @returns Array of page keys that the user can access
 */
export async function getAccessiblePages(): Promise<(keyof typeof PAGE_ACCESS)[]> {
  const role = await getCurrentUserRole();
  if (!role) return [];

  return Object.entries(PAGE_ACCESS)
    .filter(([_, rule]) => role.prority <= rule.minPriority)
    .map(([key]) => key as keyof typeof PAGE_ACCESS);
} 