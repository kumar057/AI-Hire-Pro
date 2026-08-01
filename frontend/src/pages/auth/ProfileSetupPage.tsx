import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiImage, FiPhone, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '@/components/Auth/AuthLayout';
import { FloatingInput } from '@/components/Auth/FloatingInput';
import { LoadingButton } from '@/components/Auth/LoadingButton';
import { useAuth } from '@/hooks/useAuth';
import { roleDashboardPath } from '@/utils/auth';
import { getApiErrorMessage } from '@/utils/errors';
import { profileSetupSchema, type ProfileSetupFormValues } from '@/validation/authSchemas';

function clean(value: string | undefined) {
  return value?.trim() || undefined;
}

export function ProfileSetupPage() {
  const navigate = useNavigate();
  const { updateProfile, user } = useAuth();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<ProfileSetupFormValues>({
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      phone: user?.phone ?? '',
      avatar: user?.avatar ?? '',
    },
    resolver: zodResolver(profileSetupSchema),
  });

  async function onSubmit(values: ProfileSetupFormValues) {
    if (!user) {
      return;
    }

    try {
      const updatedUser = await updateProfile({
        first_name: values.first_name,
        last_name: values.last_name,
        phone: clean(values.phone),
        avatar: clean(values.avatar),
      });
      toast.success('Profile updated.');
      navigate(roleDashboardPath(updatedUser.role), { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, 'Unable to update profile.');
      setError('root', { message });
      toast.error(message);
    }
  }

  return (
    <AuthLayout
      eyebrow="Profile setup"
      subtitle="Finish your account basics before deeper hiring workflows are added."
      title="Tune your profile for better matching."
    >
      <motion.form
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
        initial={{ opacity: 0, y: 18 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h2 className="text-3xl font-bold tracking-normal">Profile setup</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Keep this lightweight for now; business profile flows can expand later.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FloatingInput
            error={errors.first_name?.message}
            icon={<FiUser aria-hidden="true" />}
            id="profile-first-name"
            label="First name"
            registration={register('first_name')}
          />
          <FloatingInput
            error={errors.last_name?.message}
            icon={<FiUser aria-hidden="true" />}
            id="profile-last-name"
            label="Last name"
            registration={register('last_name')}
          />
        </div>
        <FloatingInput
          error={errors.phone?.message}
          icon={<FiPhone aria-hidden="true" />}
          id="profile-phone"
          label="Phone number"
          registration={register('phone')}
          type="tel"
        />
        <FloatingInput
          error={errors.avatar?.message}
          icon={<FiImage aria-hidden="true" />}
          id="profile-avatar"
          label="Avatar URL"
          registration={register('avatar')}
          type="url"
        />
        {errors.root?.message ? (
          <p className="text-sm font-medium text-rose-600 dark:text-rose-300">
            {errors.root.message}
          </p>
        ) : null}
        <LoadingButton className="w-full" isLoading={isSubmitting}>
          Save profile
        </LoadingButton>
      </motion.form>
    </AuthLayout>
  );
}

