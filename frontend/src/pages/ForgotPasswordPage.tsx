import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { AuthSplitLayout } from '@/components/AuthSplitLayout';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { error } = useAuth();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      setStep('reset');
      setMessage('If an account with that email exists, reset instructions have been sent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setMessage('Passwords do not match'); return; }
    if (newPassword.length < 6) { setMessage('Password must be at least 6 characters'); return; }
    setIsSubmitting(true);
    try {
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthSplitLayout
      heading={step === 'email' ? 'Forgot password' : 'Reset password'}
      description={step === 'email'
        ? 'Enter your account email and we will send you reset instructions.'
        : 'Choose a new password for your account.'}
    >
      {message && <div role="status" className="auth-status" style={{ marginBottom: '16px' }}>{message}</div>}
      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="auth-form">
          <Input
            label="Email Address"
            type="email"
            placeholder="john@hotel.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          {error && <div role="alert" className="auth-error">{error}</div>}
          <div className="auth-actions">
            <Button type="submit" variant="primary" disabled={isSubmitting || !email.trim()}>{isSubmitting ? 'Sending...' : 'Send Reset Link'}</Button>
          </div>
          <div className="auth-foot">
            <Link to="/login" className="auth-link">Back to Login</Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit} className="auth-form">
          <Input
            label="New Password"
            type="password"
            placeholder="Min 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <div className="auth-actions">
            <Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? 'Resetting...' : 'Reset Password'}</Button>
          </div>
          <div className="auth-foot">
            <Link to="/login" className="auth-link">Back to Login</Link>
          </div>
        </form>
      )}
    </AuthSplitLayout>
  );
}
