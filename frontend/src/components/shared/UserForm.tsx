import { useState, useEffect, type FormEvent } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import userService from '@/services/userService';
import roleService from '@/services/roleService';
import { ApiError, apiErrorMessage } from '@/services/api';

interface UserFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserForm({ id, onSuccess, onCancel }: UserFormProps) {
  const isEdit = !!id;
  const [formData, setFormData] = useState<{ name: string; email: string; password: string; roles: string[]; status: 'active' | 'inactive' }>({ name: '', email: '', password: '', roles: [], status: 'active' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    roleService.getAll().then((r) => {
      if (!cancelled) setRoles(r);
    }).catch(() => {
      if (!cancelled) setServerError('Failed to load roles');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setIsLoading(true);
    userService.getById(id).then((user) => {
      if (cancelled) return;
      if (user) {
        setFormData({ name: user.name, email: user.email, password: '', roles: user.roles || [], status: user.status });
      }
      setIsLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setServerError('Failed to load user');
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Valid email required';
    if (!isEdit && (!formData.password || formData.password.length < 6)) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setServerError('');
    try {
      const data = { name: formData.name, email: formData.email, status: formData.status, roles: formData.roles };
      if (isEdit && id) {
        const result = await userService.update(id, data);
        if (result) onSuccess();
        else setServerError('Failed to update user');
      } else {
        const result = await userService.create({ ...data, password: formData.password || 'password123' });
        if (result) onSuccess();
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setServerError(err.message);
      } else {
        setServerError(apiErrorMessage(err, 'Failed to save user'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p style={{ color: '#6B7881', fontSize: '14px' }}>Loading user...</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md, 12px)' }}>
      {serverError && <div role="alert" style={{ color: '#C85C5C', fontSize: '13px' }}>{serverError}</div>}
      <div>
        <label style={{ display: 'block', fontSize: 'var(--font-size-body, 14px)', fontWeight: 500, marginBottom: 'var(--space-xs, 4px)', color: '#6B7881' }}>Full Name</label>
        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" errorMessage={errors.name} />
        {errors.name && <span style={{ color: '#C85C5C', fontSize: '12px' }}>{errors.name}</span>}
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 'var(--font-size-body, 14px)', fontWeight: 500, marginBottom: 'var(--space-xs, 4px)', color: '#6B7881' }}>Email</label>
        <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@hotel.com" errorMessage={errors.email} />
        {errors.email && <span style={{ color: '#C85C5C', fontSize: '12px' }}>{errors.email}</span>}
      </div>
      {!isEdit && (
        <div>
          <label style={{ display: 'block', fontSize: 'var(--font-size-body, 14px)', fontWeight: 500, marginBottom: 'var(--space-xs, 4px)', color: '#6B7881' }}>Password</label>
          <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Min 6 characters" errorMessage={errors.password} />
          {errors.password && <span style={{ color: '#C85C5C', fontSize: '12px' }}>{errors.password}</span>}
        </div>
      )}
      <Select
        label="Role"
        options={[{ value: '', label: 'Select a role' }, ...roles.map((r: any) => ({ value: r.id, label: r.name }))]}
        value={formData.roles[0] || ''}
        onChange={(e) => setFormData({ ...formData, roles: [e.target.value] })}
      />
      <Select
        label="Status"
        options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]}
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
      />
      <div style={{ display: 'flex', gap: 'var(--space-md, 12px)', marginTop: 'var(--space-sm, 8px)', flexWrap: 'wrap' }}>
        <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
