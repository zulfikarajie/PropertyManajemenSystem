import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import userService from '@/services/userService';
import { UserRoleForm } from '@/components/shared/UserRoleForm';
import '../../styles/admin-responsive.css';

export default function UserRolePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = userService.getById(id || '');

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
        <Link to="/dashboard/users" className="adm-backlink"><ArrowLeft size={14} aria-hidden="true" /> Back to Users</Link>
        <h1 className="adm-h1">Assign Role</h1>
      </div>
      <UserRoleForm
        key={id}
        userId={id!}
        onSuccess={() => navigate('/dashboard/users')}
        onCancel={() => navigate('/dashboard/users')}
      />
    </div>
  );
}
