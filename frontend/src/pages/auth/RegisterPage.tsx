import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useForm, type Resolver } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiBriefcase, FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@/components/Auth/AuthLayout';
import { FloatingInput } from '@/components/Auth/FloatingInput';
import { LoadingButton } from '@/components/Auth/LoadingButton';
import { PasswordInput } from '@/components/Auth/PasswordInput';
import { PasswordStrengthMeter } from '@/components/Auth/PasswordStrengthMeter';
import { useAuth } from '@/hooks/useAuth';
import type { RegisterPayload } from '@/services/authService';
import type { UserRole } from '@/types/api';
import { readableRole, roleDashboardPath } from '@/utils/auth';
import { getApiErrorMessage } from '@/utils/errors';
import {
  candidateRegisterSchema,
  companyRegisterSchema,
  type CompanyRegisterFormValues,
} from '@/validation/authSchemas';

type RegisterPageProps = {
  role: Exclude<UserRole, 'admin'>;
};

type RegisterFormValues = CompanyRegisterFormValues;

function clean(value: string | undefined) {
  return value?.trim() || undefined;
}

export function RegisterPage({ role }: RegisterPageProps) {
  const navigate = useNavigate();
  const { register: registerAccount } = useAuth();
  const roleLabel = readableRole(role);
  const isCompany = role === 'company';
  const schema = isCompany ? companyRegisterSchema : candidateRegisterSchema;
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    watch,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      company_name: '',
      website: '',
      industry: '',
      company_size: '',
      location: '',
      description: '',
    },
    resolver: zodResolver(schema) as unknown as Resolver<RegisterFormValues>,
  });

  async function onSubmit(values: RegisterFormValues) {
    const payload: RegisterPayload = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: clean(values.phone),
      password: values.password,
      role,
    };

    if (isCompany) {
      payload.company = {
        company_name: values.company_name,
        website: clean(values.website),
        industry: clean(values.industry),
        company_size: clean(values.company_size),
        location: clean(values.location),
        description: clean(values.description),
      };
    }

    try {
      const user = await registerAccount(payload);
      toast.success(`${roleLabel} account created.`);
      navigate(roleDashboardPath(user.role), { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to create account. Please try again.');
      setError('root', { message });
      toast.error(message);
    }
  }

  return (
    <AuthLayout
      eyebrow={`${roleLabel} onboarding`}
      subtitle="Create a secure account with strong password rules, role-aware permissions, and clean onboarding paths."
      title={`Create your ${roleLabel.toLowerCase()} account.`}
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
            Start secure
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-normal text-slate-950 dark:text-white">
            {roleLabel} register
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Strong validation protects accounts before product workflows begin.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FloatingInput
            error={errors.first_name?.message}
            icon={<FiUser aria-hidden="true" />}
            id={`${role}-first-name`}
            label="First name"
            registration={register('first_name')}
          />
          <FloatingInput
            error={errors.last_name?.message}
            icon={<FiUser aria-hidden="true" />}
            id={`${role}-last-name`}
            label="Last name"
            registration={register('last_name')}
          />
        </div>
        <FloatingInput
          error={errors.email?.message}
          icon={<FiMail aria-hidden="true" />}
          id={`${role}-register-email`}
          label="Email address"
          registration={register('email')}
          type="email"
        />
        <FloatingInput
          error={errors.phone?.message}
          icon={<FiPhone aria-hidden="true" />}
          id={`${role}-phone`}
          label="Phone number"
          registration={register('phone')}
          type="tel"
        />

        {isCompany ? (
          <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
            <FloatingInput
              error={errors.company_name?.message}
              icon={<FiBriefcase aria-hidden="true" />}
              id="company-name"
              label="Company name"
              registration={register('company_name')}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FloatingInput
                error={errors.website?.message}
                id="company-website"
                label="Website"
                registration={register('website')}
                type="url"
              />
              <FloatingInput
                error={errors.industry?.message}
                id="company-industry"
                label="Industry"
                registration={register('industry')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FloatingInput
                error={errors.company_size?.message}
                id="company-size"
                label="Company size"
                registration={register('company_size')}
              />
              <FloatingInput
                error={errors.location?.message}
                icon={<FiMapPin aria-hidden="true" />}
                id="company-location"
                label="Location"
                registration={register('location')}
              />
            </div>
          </div>
        ) : null}

        <PasswordInput
          error={errors.password?.message}
          id={`${role}-register-password`}
          label="Password"
          registration={register('password')}
        />
        <PasswordStrengthMeter password={watch('password')} />
        <PasswordInput
          error={errors.confirm_password?.message}
          id={`${role}-confirm-password`}
          label="Confirm password"
          registration={register('confirm_password')}
        />

        {errors.root?.message ? (
          <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200">
            {errors.root.message}
          </p>
        ) : null}

        <LoadingButton className="w-full" isLoading={isSubmitting}>
          Create {roleLabel.toLowerCase()} account
        </LoadingButton>

        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          Already registered?{' '}
          <Link
            className="font-bold text-cyan-700 hover:text-cyan-900 dark:text-cyan-300"
            to={`/${role}/login`}
          >
            Sign in
          </Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
}
