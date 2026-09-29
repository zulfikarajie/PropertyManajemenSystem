import { useState, useEffect, type FormEvent } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import userService from '@/services/userService';
import roleService from '@/services/roleService';

interface UserFormProps {
  id?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserForm({ id, onSuccess, onCancel }: UserFormProps) {
  const isEdit = !!id;
  const [formData, setFormData] = useState<{ name: string; email: string; password: string; roles: string[]; status: 'active' | 'inactive' }>({ name: '', email: '', password: '', roles: [], status: 'active' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const roles = roleService.getAll();

  useEffect(() => {
    if (id) {
      const user = userService.getById(id);
      if (user) {
        setFormData({ name: user.name, email: user.email, password: '', roles: user.roles || [], status: user.status });
      }
    }
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
    try {
      const data = { name: formData.name, email: formData.email, status: formData.status, roles: formData.roles };
      if (isEdit && id) {
        const result = userService.update(id, data);
        if (result) onSuccess();
      } else {
        const result = userService.create({ ...data, password: formData.password || 'password123' });
        if (result) onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md, 12px)' }}>
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
