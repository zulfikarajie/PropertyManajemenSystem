import { useState } from 'react';
import { Button } from './Button';
import { Select } from './Select';
import userService from '@/services/userService';
import roleService from '@/services/roleService';

interface UserRoleFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserRoleForm({ userId, onSuccess, onCancel }: UserRoleFormProps) {
  const user = userService.getById(userId);
  const roles = roleService.getAll();
  const [selectedRole, setSelectedRole] = useState(() => (user && user.roles.length > 0 ? user.roles[0] : ''));

  const handleSave = () => {
    if (!selectedRole) return;
    userService.update(userId, { roles: [selectedRole] });
    onSuccess();
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md, 12px)' }}>
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #C7BBAB', borderRadius: '8px', padding: 'var(--space-xl, 20px)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-lg, 16px)', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: 'var(--font-size-caption, 12px)', color: '#6B7881' }}>Name</span>
            <p style={{ fontWeight: 600, color: '#232D36', margin: 0 }}>{user.name}</p>
          </div>
          <div>
            <span style={{ fontSize: 'var(--font-size-caption, 12px)', color: '#6B7881' }}>Email</span>
            <p style={{ fontWeight: 600, color: '#232D36', margin: 0 }}>{user.email}</p>
          </div>
          <div>
            <span style={{ fontSize: 'var(--font-size-caption, 12px)', color: '#6B7881' }}>Status</span>
            <p style={{ fontWeight: 600, color: '#232D36', margin: 0 }}>{user.status}</p>
          </div>
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 'var(--font-size-body, 14px)', fontWeight: 500, marginBottom: 'var(--space-xs, 4px)', color: '#232D36' }}>Role</label>
        <Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} options={[{ value: '', label: 'Select a role' }, ...roles.map((r: any) => ({ value: r.id, label: r.name }))]} />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-md, 12px)', flexWrap: 'wrap' }}>
        <Button variant="primary" onClick={handleSave}>Save Role</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
