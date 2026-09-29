import { usePermissionContext } from '../stores/permissionStore';

export function usePermissions() {
  const { permissions, hasPermission } = usePermissionContext();

  return { permissions, hasPermission };
}
