import authService from './authService';

class PermissionService {
  getAll(): any[] {
    return authService.getAllPermissions();
  }

  getById(id: string): any | undefined {
    return authService.getPermissionById(id);
  }

  getByName(name: string): any | undefined {
    return authService.getPermissionByName(name);
  }

  create(data: any): any {
    return authService.createPermission(data);
  }

  update(id: string, updates: any): any | null {
    return authService.updatePermission(id, updates);
  }

  delete(id: string): boolean {
    return authService.deletePermission(id);
  }
}

export const permissionService = new PermissionService();
export default permissionService;
