import { render, screen } from '@testing-library/react';
import { ActivityTimeline } from '@/components/Notifications/ActivityTimeline';

test('renders typed activity details', () => {
  render(
    <ActivityTimeline
      items={[
        {
          id: 'activity-1',
          title: 'Application submitted',
          description: 'The application was received.',
          occurred_at: '2026-08-03T10:00:00Z',
          user: 'Ava Stone',
          category: 'candidate',
          icon: 'user',
        },
      ]}
    />,
  );
  expect(screen.getByText('Application submitted')).toBeInTheDocument();
  expect(screen.getByText('The application was received.')).toBeInTheDocument();
  expect(screen.getByText('candidate')).toBeInTheDocument();
  expect(screen.getByText(/Ava Stone/)).toBeInTheDocument();
});
