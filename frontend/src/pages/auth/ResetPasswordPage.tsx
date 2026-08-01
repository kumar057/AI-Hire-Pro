import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiKey } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';

import { AuthLayout } from '@/components/Auth/AuthLayout';
import { FloatingInput } from '@/components/Auth/FloatingInput';
import { LoadingButton } from '@/components/Auth/LoadingButton';
import { PasswordInput } from '@/components/Auth/PasswordInput';
import { PasswordStrengthMeter } from '@/components/Auth/PasswordStrengthMeter';
import { authService } from '@/services/authService';
import { getApiErrorMessage } from '@/utils/errors';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/validation/authSchemas';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const {
    formState: { errors, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
    watch,
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { token, password: '', confirm_password: '' },
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    setValue('token', token);
  }, [setValue, token]);

  async function onSubmit(values: ResetPasswordFormValues) {
    try {
      const response = await authService.resetPassword(values.token, values.password);
      toast.success(response.message);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to reset password.');
      setError('root', { message });
      toast.error(message);
    }
  }

  return (
    <AuthLayout
      eyebrow="Secure reset"
      subtitle="Create a new password and revoke previous refresh sessions."
      title="Reset your password with a verified token."
    >
      <motion.form
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
        initial={{ opacity: 0, y: 18 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h2 className="text-3xl font-bold tracking-normal">Reset password</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Paste the reset token from your email and choose a stronger password.
          </p>
        </div>
        <FloatingInput
          error={errors.token?.message}
          icon={<FiKey aria-hidden="true" />}
          id="reset-token"
          label="Reset token"
          registration={register('token')}
        />
        <PasswordInput
          error={errors.password?.message}
          id="reset-password"
          label="New password"
          registration={register('password')}
        />
        <PasswordStrengthMeter password={watch('password')} />
        <PasswordInput
          error={errors.confirm_password?.message}
          id="reset-confirm-password"
          label="Confirm password"
          registration={register('confirm_password')}
        />
        {errors.root?.message ? (
          <p className="text-sm font-medium text-rose-600 dark:text-rose-300">
            {errors.root.message}
          </p>
        ) : null}
        {isSubmitSuccessful ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200">
            Password reset complete. You can sign in with your new password.
          </p>
        ) : null}
        <LoadingButton className="w-full" isLoading={isSubmitting}>
          Reset password
        </LoadingButton>
        <Link className="block text-center text-sm font-bold text-cyan-700 dark:text-cyan-300" to="/candidate/login">
          Back to login
        </Link>
      </motion.form>
    </AuthLayout>
  );
}

