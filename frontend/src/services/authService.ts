import usersData from '../data/mock/users.json';
import rolesData from '../data/mock/roles.json';
import permissionsData from '../data/mock/permissions.json';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface MockRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface MockPermission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  group: string;
}

const mockUsers = usersData as MockUser[];
const mockRoles = rolesData as MockRole[];
const mockPermissions = permissionsData as MockPermission[];

class AuthService {
  private userData: MockUser[] = [...mockUsers];
  private roleData: MockRole[] = [...mockRoles];
  private permissionData: MockPermission[] = [...mockPermissions];

  login(email: string, password: string): { user: MockUser; token: string } | null {
    const user = this.userData.find(
      (u) => u.email === email && u.password === password && u.status === 'active'
    );
    if (user) {
      const token = btoa(JSON.stringify({ userId: user.id, email: user.email, exp: Date.now() + 3600000 }));
      user.lastLoginAt = new Date().toISOString();
      const userCopy = { ...user };
      userCopy.status = user.status;
      userCopy.roles = [...user.roles];
      localStorage.setItem('pms_token', token);
      localStorage.setItem('pms_user', JSON.stringify(userCopy));
      return { user: userCopy, token };
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('pms_token');
    localStorage.removeItem('pms_user');
  }

  register(data: { name: string; email: string; password: string }): MockUser | null {
    const existing = this.userData.find((u) => u.email === data.email);
    if (existing) return null;
    const newUser: MockUser = {
      id: `user-${String(this.userData.length + 1).padStart(3, '0')}`,
      name: data.name,
      email: data.email,
      password: data.password,
      roles: ['role-003'],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.userData.push(newUser);
    const copy = { ...newUser, roles: [...newUser.roles] };
    return copy;
  }

  getUserById(id: string): MockUser | undefined {
    return this.userData.find((u) => u.id === id);
  }

  getAllUsers(): MockUser[] {
    return this.userData.map((u) => ({ ...u, roles: [...u.roles] }));
  }

  updateUser(id: string, updates: Partial<MockUser>): MockUser | null {
    const index = this.userData.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.userData[index] = { ...this.userData[index], ...updates, updatedAt: new Date().toISOString() };
    const u = this.userData[index];
    return { ...u, roles: [...u.roles], status: u.status as 'active' | 'inactive' };
  }

  deleteUser(id: string): boolean {
    const index = this.userData.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.userData.splice(index, 1);
    return true;
  }

  toggleUserStatus(id: string): boolean {
    const user = this.userData.find((u) => u.id === id);
    if (!user) return false;
    user.status = user.status === 'active' ? 'inactive' : 'active';
    user.updatedAt = new Date().toISOString();
    return true;
  }

  getRoleById(id: string): MockRole | undefined {
    return this.roleData.find((r) => r.id === id);
  }

  getAllRoles(): MockRole[] {
    return this.roleData.map((r) => ({ ...r, permissions: [...r.permissions] }));
  }

  createRole(data: { name: string; description: string; permissions: string[] }): MockRole {
    const newRole: MockRole = {
      id: `role-${String(this.roleData.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.roleData.push(newRole);
    return { ...newRole, permissions: [...newRole.permissions] };
  }

  updateRole(id: string, updates: Partial<MockRole>): MockRole | null {
    const index = this.roleData.findIndex((r) => r.id === id);
    if (index === -1) return null;
    this.roleData[index] = { ...this.roleData[index], ...updates, updatedAt: new Date().toISOString() };
    const r = this.roleData[index];
    return { ...r, permissions: [...r.permissions], status: r.status as 'active' | 'inactive' };
  }

  deleteRole(id: string): boolean {
    const index = this.roleData.findIndex((r) => r.id === id);
    if (index === -1) return false;
    this.roleData.splice(index, 1);
    return true;
  }

  getAllPermissions(): MockPermission[] {
    return [...this.permissionData];
  }

  getPermissionById(id: string): MockPermission | undefined {
    return this.permissionData.find((p) => p.id === id);
  }

  getPermissionByName(name: string): MockPermission | undefined {
    return this.permissionData.find((p) => p.name === name);
  }

  createPermission(data: { name: string; description: string; resource: string; action: string; group: string }): MockPermission {
    const newPerm: MockPermission = {
      id: `perm-${String(this.permissionData.length + 1).padStart(3, '0')}`,
      ...data,
    };
    this.permissionData.push(newPerm);
    return { ...newPerm };
  }

  updatePermission(id: string, updates: Partial<MockPermission>): MockPermission | null {
    const index = this.permissionData.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.permissionData[index] = { ...this.permissionData[index], ...updates };
    return { ...this.permissionData[index] };
  }

  deletePermission(id: string): boolean {
    const index = this.permissionData.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.permissionData.splice(index, 1);
    return true;
  }

  getUserPermissions(userId: string): string[] {
    const user = this.userData.find((u) => u.id === userId);
    if (!user) return [];
    const allPermissions = new Set<string>();
    user.roles.forEach((roleId) => {
      const role = this.roleData.find((r) => r.id === roleId);
      if (role) {
        role.permissions.forEach((p) => allPermissions.add(p));
      }
    });
    return Array.from(allPermissions);
  }

  changePassword(userId: string, currentPassword: string, newPassword: string): boolean {
    const user = this.userData.find((u) => u.id === userId);
    if (!user || user.password !== currentPassword) return false;
    user.password = newPassword;
    user.updatedAt = new Date().toISOString();
    return true;
  }

  resetPassword(email: string, newPassword: string): boolean {
    const user = this.userData.find((u) => u.email === email);
    if (!user) return false;
    user.password = newPassword;
    user.updatedAt = new Date().toISOString();
    return true;
  }

  generateResetToken(email: string): string | null {
    const user = this.userData.find((u) => u.email === email);
    if (!user) return null;
    return btoa(JSON.stringify({ email, exp: Date.now() + 900000 }));
  }

  restoreSession(): { user: MockUser; token: string } | null {
    const token = localStorage.getItem('pms_token');
    const userJson = localStorage.getItem('pms_user');
    if (!token || !userJson) return null;
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp < Date.now()) {
        localStorage.removeItem('pms_token');
        localStorage.removeItem('pms_user');
        return null;
      }
      const user = this.userData.find((u) => u.id === decoded.userId);
      if (!user || user.status !== 'active') return null;
      return { user: { ...user, roles: [...user.roles] }, token };
    } catch {
      localStorage.removeItem('pms_token');
      localStorage.removeItem('pms_user');
      return null;
    }
  }

  validateResetToken(token: string): boolean {
    try {
      const data = JSON.parse(atob(token));
      return data.exp > Date.now();
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;
