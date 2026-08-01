import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

import { LoadingButton } from '@/components/Auth/LoadingButton';
import { PasswordInput } from '@/components/Auth/PasswordInput';
import { PasswordStrengthMeter } from '@/components/Auth/PasswordStrengthMeter';

function PasswordHarness() {
  const { register } = useForm<{ password: string }>({
    defaultValues: { password: '' },
  });

  return (
    <PasswordInput
      id="password"
      label="Password"
      registration={register('password')}
    />
  );
}

describe('auth form components', () => {
  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<PasswordHarness />);

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: /show password/i }));

    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('shows password strength feedback', () => {
    render(<PasswordStrengthMeter password="SecurePass123!" />);

    expect(screen.getByText(/password strength: excellent/i)).toBeInTheDocument();
    expect(screen.getByText(/5\/5 requirements/i)).toBeInTheDocument();
  });

  it('disables loading buttons while submitting', () => {
    render(<LoadingButton isLoading>Continue</LoadingButton>);

    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();
  });
});

