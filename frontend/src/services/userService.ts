import authService from './authService';

class UserService {
  getAll(): any[] {
    return authService.getAllUsers();
  }

  getById(id: string): any | undefined {
    return authService.getUserById(id);
  }

  create(data: any): any {
    return authService.register(data);
  }

  update(id: string, updates: any): any | null {
    return authService.updateUser(id, updates);
  }

  delete(id: string): boolean {
    return authService.deleteUser(id);
  }

  toggleStatus(id: string): boolean {
    return authService.toggleUserStatus(id);
  }

  getUserPermissions(userId: string): string[] {
    return authService.getUserPermissions(userId);
  }
}

export const userService = new UserService();
export default userService;
