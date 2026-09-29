import authService from './authService';

class RoleService {
  getAll(): any[] {
    return authService.getAllRoles();
  }

  getById(id: string): any | undefined {
    return authService.getRoleById(id);
  }

  create(data: any): any {
    return authService.createRole(data);
  }

  update(id: string, updates: any): any | null {
    return authService.updateRole(id, updates);
  }

  delete(id: string): boolean {
    return authService.deleteRole(id);
  }
}

export const roleService = new RoleService();
export default roleService;
