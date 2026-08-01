import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiMail } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

import { FloatingInput } from '@/components/Auth/FloatingInput';
import { LoadingButton } from '@/components/Auth/LoadingButton';
import { PasswordInput } from '@/components/Auth/PasswordInput';
import { AuthLayout } from '@/components/Auth/AuthLayout';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/api';
import { getApiErrorMessage } from '@/utils/errors';
import { readableRole, roleDashboardPath } from '@/utils/auth';
import { loginSchema, type LoginFormValues } from '@/validation/authSchemas';

type LoginPageProps = {
  role: Exclude<UserRole, 'admin'>;
};

export function LoginPage({ role }: LoginPageProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const roleLabel = readableRole(role);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<LoginFormValues>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const user = await login(values, role);
      toast.success(`Welcome back, ${user.first_name}.`);
      navigate(roleDashboardPath(user.role), { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to sign in. Please try again.');
      setError('root', { message });
      toast.error(message);
    }
  }

  return (
    <AuthLayout
      eyebrow={`${roleLabel} access`}
      subtitle="Secure authentication with role-aware redirects, protected routes, and token-backed sessions."
      title={`Sign in to your ${roleLabel.toLowerCase()} workspace.`}
    >
      <motion.form
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
        initial={{ opacity: 0, y: 18 }}
        onSubmit={handleSubmit(onSubmit)}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-cyan-700 dark:text-cyan-300">
            Welcome back
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 dark:text-white">
            {roleLabel} login
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Enter your credentials to continue to the right dashboard.
          </p>
        </div>

        <FloatingInput
          error={errors.email?.message}
          icon={<FiMail aria-hidden="true" />}
          id={`${role}-email`}
          label="Email address"
          registration={register('email')}
          type="email"
        />
        <PasswordInput
          error={errors.password?.message}
          id={`${role}-password`}
          label="Password"
          registration={register('password')}
        />

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <input className="size-4 rounded border-slate-300 text-cyan-600" type="checkbox" />
            Remember me
          </label>
          <Link
            className="font-semibold text-cyan-700 hover:text-cyan-900 dark:text-cyan-300"
            to="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>

        {errors.root?.message ? (
          <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200">
            {errors.root.message}
          </p>
        ) : null}

        <LoadingButton className="w-full" isLoading={isSubmitting}>
          Sign in
        </LoadingButton>

        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          New here?{' '}
          <Link
            className="font-bold text-cyan-700 hover:text-cyan-900 dark:text-cyan-300"
            to={`/${role}/register`}
          >
            Create {roleLabel.toLowerCase()} account
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
}

