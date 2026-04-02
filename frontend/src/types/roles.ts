// Extended role system with permissions
export type UserRole = 'customer' | 'agent' | 'admin' | 'super_admin' | 'operator' | 'support';

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface RoleConfig {
  name: UserRole;
  displayName: string;
  permissions: Permission[];
  description: string;
}

// Role definitions with permissions
export const ROLES: Record<UserRole, RoleConfig> = {
  customer: {
    name: 'customer',
    displayName: 'Customer',
    description: 'Regular user who can book tickets',
    permissions: [
      { resource: 'bookings', actions: ['create', 'read'] },
      { resource: 'trips', actions: ['read'] },
      { resource: 'buses', actions: ['read'] },
      { resource: 'routes', actions: ['read'] },
      { resource: 'reviews', actions: ['create', 'read', 'update'] },
      { resource: 'profile', actions: ['read', 'update'] }
    ]
  },
  agent: {
    name: 'agent',
    displayName: 'Booking Agent',
    description: 'Agent who can book tickets for customers',
    permissions: [
      { resource: 'bookings', actions: ['create', 'read', 'update'] },
      { resource: 'trips', actions: ['read'] },
      { resource: 'buses', actions: ['read'] },
      { resource: 'routes', actions: ['read'] },
      { resource: 'wallet', actions: ['read'] },
      { resource: 'commission', actions: ['read'] },
      { resource: 'profile', actions: ['read', 'update'] }
    ]
  },
  support: {
    name: 'support',
    displayName: 'Support Staff',
    description: 'Customer support staff',
    permissions: [
      { resource: 'bookings', actions: ['read', 'update'] },
      { resource: 'users', actions: ['read'] },
      { resource: 'trips', actions: ['read'] },
      { resource: 'buses', actions: ['read'] },
      { resource: 'routes', actions: ['read'] },
      { resource: 'tickets', actions: ['read', 'update'] },
      { resource: 'refunds', actions: ['create', 'read'] }
    ]
  },
  operator: {
    name: 'operator',
    displayName: 'Bus Operator',
    description: 'Bus operator who manages their buses and trips',
    permissions: [
      { resource: 'buses', actions: ['create', 'read', 'update'] },
      { resource: 'trips', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'routes', actions: ['read'] },
      { resource: 'bookings', actions: ['read'] },
      { resource: 'reports', actions: ['read'] },
      { resource: 'operator_profile', actions: ['read', 'update'] }
    ]
  },
  admin: {
    name: 'admin',
    displayName: 'Administrator',
    description: 'System administrator with full access',
    permissions: [
      { resource: 'buses', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'trips', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'routes', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'bookings', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'users', actions: ['read', 'update', 'delete'] },
      { resource: 'agents', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'operators', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'reports', actions: ['read'] },
      { resource: 'settings', actions: ['read', 'update'] },
      { resource: 'coupons', actions: ['create', 'read', 'update', 'delete'] }
    ]
  },
  super_admin: {
    name: 'super_admin',
    displayName: 'Super Administrator',
    description: 'Super admin with unrestricted access',
    permissions: [
      { resource: '*', actions: ['create', 'read', 'update', 'delete'] }
    ]
  }
};

// Helper function to check if role has permission
export function hasPermission(
  role: UserRole,
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean {
  const roleConfig = ROLES[role];
  if (!roleConfig) return false;

  // Super admin has all permissions
  if (role === 'super_admin') return true;

  return roleConfig.permissions.some(
    (perm) =>
      (perm.resource === resource || perm.resource === '*') &&
      perm.actions.includes(action)
  );
}

// Get all permissions for a role
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLES[role]?.permissions || [];
}
