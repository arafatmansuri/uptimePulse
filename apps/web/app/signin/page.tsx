import { AuthLayout } from '@/components/auth/auth-layout';
import { SignInForm } from '@/components/auth/sign-in-form';

export const metadata = {
  title: 'Sign in — UptimePulse',
  description: 'Sign in to your UptimePulse account.',
};

export default function SignInPage() {
  return (
    <AuthLayout title="Sign in to your account" subtitle="Welcome back. Pick up where you left off.">
      <SignInForm />
    </AuthLayout>
  );
}
