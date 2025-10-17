import { usePage } from '@inertiajs/react';
import { SharedData } from '../types';

export function usePermissions() {
  const { auth } = usePage<SharedData>().props;

  const user = auth.user;

  const hasPermission = (permission: string | string[]): boolean => {
    if (!user) return false;
    
    // Ensure user has permissions array
    const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];
    
    const permissions = Array.isArray(permission) ? permission : [permission];
    return permissions.some(p => userPermissions.includes(p));
  };

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    
    // Ensure user has roles array
    const userRoles = Array.isArray(user.roles) ? user.roles : [];
    
    const roles = Array.isArray(role) ? role : [role];
    return roles.some(r => userRoles.includes(r));
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    
    // Ensure user has permissions array
    const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];
    
    return permissions.some(p => userPermissions.includes(p));
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    
    // Ensure user has roles array
    const userRoles = Array.isArray(user.roles) ? user.roles : [];
    
    return roles.some(r => userRoles.includes(r));
  };

  return {
    user,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAnyRole,
  };
}