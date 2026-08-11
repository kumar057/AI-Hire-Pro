import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ActivityTimeline } from '@/components/Notifications/ActivityTimeline';
import { NotificationSkeleton } from '@/components/Notifications/NotificationSkeleton';
import { notificationService } from '@/services/notificationService';
import type { ActivityItem } from '@/types/notifications';

export function ActivityFeedPage() {
  const [items, setItems] = useState<ActivityItem[]>();
  useEffect(() => {
    void notificationService
      .getActivity()
      .then((data) => setItems(data.activities))
      .catch(() => toast.error('Unable to load activity.'));
  }, []);
  return (
    <motion.div animate={{ opacity: 1 }} className="mt-6 space-y-5" initial={{ opacity: 0 }}>
      <header>
        <p className="text-sm font-bold uppercase text-cyan-700 dark:text-cyan-300">
          Activity feed
        </p>
        <h1 className="mt-2 text-3xl font-bold">Workspace timeline</h1>
        <p className="mt-2 text-slate-500">
          Recent candidate, company, recruiter, admin, and system events.
        </p>
      </header>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
        {items ? <ActivityTimeline items={items} /> : <NotificationSkeleton />}
      </section>
    </motion.div>
  );
}
