import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { UserForm } from '@/components/shared/UserForm';
import userService from '@/services/userService';
import { Card } from '@/components/shared/Card';
import '../../styles/admin-responsive.css';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [showEdit, setShowEdit] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setIsLoading(true);
    userService.getById(id).then((u) => {
      if (!cancelled) {
        setUser(u ?? null);
        setIsLoading(false);
      }
    }).catch(() => {
      if (!cancelled) {
        setUser(null);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id, showEdit]);

  if (isLoading) {
    return (
      <div style={{ padding: 'var(--space-xl, 20px)', textAlign: 'center' }}>
        <p style={{ color: '#6B7881' }}>Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: 'var(--space-xl, 20px)', textAlign: 'center' }}>
        <h2 style={{ color: '#232D36', fontFamily: 'var(--font-family-sans)' }}>User not found</h2>
        <Link to="/dashboard/users" style={{ color: '#97764D', fontWeight: 600 }}>Back to Users</Link>
      </div>
    );
  }

  return (
    <div className="adm-page adm-page--narrow">
      <div className="adm-head">
        <h1 className="adm-h1">User Details</h1>
        <Button variant="outline" className="adm-cta" aria-label="Edit user" onClick={() => setShowEdit(true)}><Pencil size={14} aria-hidden="true" /></Button>
      </div>
      <Card title="User Information">
        <div style={{ display: 'grid', gap: 'var(--space-md, 12px)' }}>
          {[
            { label: 'Name', value: user.name },
            { label: 'Email', value: user.email },
            { label: 'Status', value: user.status },
            { label: 'Roles', value: user.roles?.map((r: string) => r.replace('role-', 'Role ')).join(', ') || '-' },
            { label: 'Created', value: new Date(user.createdAt).toLocaleDateString() },
            { label: 'Last Login', value: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'N/A' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm, 8px) 0', borderBottom: '1px solid #C7BBAB' }}>
              <span style={{ fontWeight: 500, color: '#6B7881' }}>{item.label}</span>
              <span style={{ fontWeight: 600, color: '#232D36' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ marginTop: 'var(--space-lg, 16px)' }}>
        <Link to="/dashboard/users" className="adm-backlink"><ArrowLeft size={14} aria-hidden="true" /> Back to Users</Link>
      </div>

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit User" size="md">
        <UserForm key={user.id} id={user.id} onSuccess={() => setShowEdit(false)} onCancel={() => setShowEdit(false)} />
      </Modal>
    </div>
  );
}
