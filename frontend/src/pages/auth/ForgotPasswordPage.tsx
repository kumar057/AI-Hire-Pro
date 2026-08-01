import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { AuthLayout } from '@/components/Auth/AuthLayout';
import { FloatingInput } from '@/components/Auth/FloatingInput';
import { LoadingButton } from '@/components/Auth/LoadingButton';
import { authService } from '@/services/authService';
import { getApiErrorMessage } from '@/utils/errors';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/validation/authSchemas';

export function ForgotPasswordPage() {
  const {
    formState: { errors, isSubmitSuccessful, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: '' },
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      const response = await authService.forgotPassword(values.email);
      toast.success(response.message);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to request a reset link.');
      setError('root', { message });
      toast.error(message);
    }
  }

  return (
    <AuthLayout
      eyebrow="Account recovery"
      subtitle="Reset requests use a generic response so account existence is never exposed."
      title="Recover access without leaking account data."
    >
      <motion.form
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
        initial={{ opacity: 0, y: 18 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h2 className="text-3xl font-bold tracking-normal">Forgot password</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Enter your email and we will send reset instructions if the account exists.
          </p>
        </div>
        <FloatingInput
          error={errors.email?.message}
          icon={<FiMail aria-hidden="true" />}
          id="forgot-email"
          label="Email address"
          registration={register('email')}
          type="email"
        />
        {errors.root?.message ? (
          <p className="text-sm font-medium text-rose-600 dark:text-rose-300">
            {errors.root.message}
          </p>
        ) : null}
        {isSubmitSuccessful ? (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200">
            Check your email for reset instructions.
          </p>
        ) : null}
        <LoadingButton className="w-full" isLoading={isSubmitting}>
          Send reset link
        </LoadingButton>
        <Link className="block text-center text-sm font-bold text-cyan-700 dark:text-cyan-300" to="/candidate/login">
          Back to login
        </Link>
      </motion.form>
    </AuthLayout>
  );
}

