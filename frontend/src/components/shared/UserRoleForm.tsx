import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Select } from './Select';
import userService from '@/services/userService';
import roleService from '@/services/roleService';
import { apiErrorMessage } from '@/services/api';

interface UserRoleFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserRoleForm({ userId, onSuccess, onCancel }: UserRoleFormProps) {
  const [user, setUser] = useState<any | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.all([userService.getById(userId), roleService.getAll()])
      .then(([u, r]) => {
        if (cancelled) return;
        setUser(u ?? null);
        setRoles(r);
        if (u && Array.isArray(u.roles) && u.roles.length > 0) setSelectedRole(u.roles[0]);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(apiErrorMessage(err, 'Failed to load data'));
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleSave = async () => {
    if (!selectedRole || isSaving) return;
    setIsSaving(true);
    setError('');
    try {
      await userService.update(userId, { roles: [selectedRole] });
      onSuccess();
    } catch (err) {
      setError(apiErrorMessage(err, 'Failed to assign role'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p style={{ color: '#6B7881', fontSize: '14px' }}>Loading...</p>;
  }

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md, 12px)' }}>
      {error && <div role="alert" style={{ color: '#C85C5C', fontSize: '13px' }}>{error}</div>}
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
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Role'}</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}
