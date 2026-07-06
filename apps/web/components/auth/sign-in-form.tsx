'use client';

import { Button } from '@/components/ui/button';
import { useAuthMutation } from '@/lib/queries/authQueries';
import { signInSchema, type SignInValues } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function SignInForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [signinSuccessMessage, setSigninSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  const authMutation = useAuthMutation();
  const onSubmit = async (values: SignInValues) => {
    setServerError(null);
    setLoading(true);
    authMutation.mutate({ data: values, endpoint: '/signin' },{
      onError(error) {
        setSigninSuccessMessage(null);
        setServerError(error.message);
      },
      onSuccess(data){
        setServerError(null);
        setSigninSuccessMessage(data.message);
        // navigate.push('/dashboard');
      },
      onSettled() {
        setLoading(false);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {serverError}
        </div>
      )}
      {signinSuccessMessage && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {signinSuccessMessage}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-200">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            {...register('email')}
            className="w-full rounded-xl border border-ink-700 bg-ink-900/60 py-3 pl-10 pr-3 text-sm text-white placeholder:text-ink-500 outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-ink-200">
            Password
          </label>
          <a href="#" className="text-xs font-medium text-brand-300 hover:text-brand-200">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register('password')}
            className="w-full rounded-xl border border-ink-700 bg-ink-900/60 py-3 pl-10 pr-3 text-sm text-white placeholder:text-ink-500 outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
      </Button>

      <p className="text-center text-sm text-ink-400">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="font-semibold text-brand-300 hover:text-brand-200">
          Sign up free
        </a>
      </p>
    </form>
  );
}
