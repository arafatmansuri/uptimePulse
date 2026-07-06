'use client';

import { Button } from '@/components/ui/button';
import { useAuthMutation } from '@/lib/queries/authQueries';
import { signUpSchema, type SignUpValues } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Lock, Mail, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const OTP_LENGTH = 6;

export function SignUpForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [signupSuccessMessage, setSignupSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpStage, setOtpStage] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });
  const authMutation = useAuthMutation();
  const navigate = useRouter();

  const onSubmit = async (values: SignUpValues) => {
    setServerError(null);
    setLoading(true);
    
    authMutation.mutate({ data: values, endpoint: '/signup' },{
      onError(error) {
        setServerError(error.message);
      },
      onSuccess(data) {
        console.log("success",data);
        setSignupSuccessMessage(data.message);
        // navigate.push('/dashboard');
      },
      onSettled() {
        setLoading(false);
      },
    });
    // pendingEmailRef.current = values.email;
    setPendingEmail(values.email);
    // setOtpStage(true);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    setOtpError(null);
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!digits) return;
    const next = Array(OTP_LENGTH).fill('');
    digits.split('').forEach((d, i) => (next[i] = d));
    setOtp(next);
    inputsRef.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  };

  const verifyOtp = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    setOtpError(null);
    setOtpLoading(true);
    // const { error } = await supabase.auth.verifyOtp({
    //   email: pendingEmailRef.current,
    //   token: code,
    //   type: 'signup',
    // });
    const error = {message:""}
    setOtpLoading(false);
    if (error) {
      setOtpError(error.message);
      return;
    }
    window.location.href = '/';
  };

  if (otpStage) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setOtpStage(false)}
          className="flex items-center gap-1.5 text-sm text-ink-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div>
          <h2 className="text-xl font-bold text-white">Verify your email</h2>
          <p className="mt-1.5 text-sm text-ink-400">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-ink-200">{pendingEmail}</span>. Enter it
            below to activate your account.
          </p>
        </div>

        {otpError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {otpError}
          </div>
        )}

        <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className="h-14 w-12 rounded-xl border border-ink-700 bg-ink-900/60 text-center text-xl font-bold text-white outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
            />
          ))}
        </div>

        <Button size="lg" className="w-full" onClick={verifyOtp} disabled={otpLoading}>
          {otpLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify email'}
        </Button>

        <p className="text-center text-sm text-ink-400">
          Didn&apos;t get a code?{' '}
          <button className="font-semibold text-brand-300 hover:text-brand-200">Resend</button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {serverError}
        </div>
      )}
      {s && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink-200">
          Name
        </label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            {...register('name')}
            className="w-full rounded-xl border border-ink-700 bg-ink-900/60 py-3 pl-10 pr-3 text-sm text-white placeholder:text-ink-500 outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
      </div>

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
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-200">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...register('password')}
            className="w-full rounded-xl border border-ink-700 bg-ink-900/60 py-3 pl-10 pr-3 text-sm text-white placeholder:text-ink-500 outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-ink-200">
          Confirm password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            {...register('confirmPassword')}
            className="w-full rounded-xl border border-ink-700 bg-ink-900/60 py-3 pl-10 pr-3 text-sm text-white placeholder:text-ink-500 outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
      </Button>

      <p className="text-center text-sm text-ink-400">
        Already have an account?{' '}
        <a href="/signin" className="font-semibold text-brand-300 hover:text-brand-200">
          Sign in
        </a>
      </p>
    </form>
  );
}
