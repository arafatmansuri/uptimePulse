import { AuthLayout } from '@/components/auth/auth-layout';
import { SignUpForm } from '@/components/auth/sign-up-form';

export const metadata = {
  title: 'Sign up — UptimePulse',
  description: 'Create your free UptimePulse account.',
};

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your free account"
      subtitle="Start monitoring in 2 minutes. No credit card required."
    >
      <SignUpForm />
    </AuthLayout>
  );
}
