import { useEffect, useState } from 'react';
import { FiBell, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ActivityTimeline } from '@/components/Notifications/ActivityTimeline';
import { NotificationSkeleton } from '@/components/Notifications/NotificationSkeleton';
import { notificationService } from '@/services/notificationService';
import type { ActivityItem, NotificationList } from '@/types/notifications';

export function DashboardFeedWidgets({ root }: { root: string }) {
  const [notifications, setNotifications] = useState<NotificationList>();
  const [activities, setActivities] = useState<ActivityItem[]>();
  useEffect(() => {
    void Promise.all([
      notificationService.getNotifications({ page_size: 3 }),
      notificationService.getActivity(),
    ])
      .then(([noticeData, activityData]) => {
        setNotifications(noticeData);
        setActivities(activityData.activities.slice(0, 3));
      })
      .catch(() => {
        setNotifications(undefined);
        setActivities(undefined);
      });
  }, []);
  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
        <FeedHeader
          count={notifications?.unread_count}
          href={`${root}/notifications`}
          title="Recent notifications"
        />
        {notifications ? (
          <div className="mt-3 divide-y divide-slate-200 dark:divide-white/10">
            {notifications.notifications.map((item) => (
              <div className="flex gap-3 py-3" key={item.id}>
                <span
                  className={`mt-1 size-2 shrink-0 rounded-full ${item.is_read ? 'bg-slate-300' : 'bg-rose-500'}`}
                />
                <div>
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <NotificationSkeleton compact />
          </div>
        )}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/70">
        <FeedHeader href={`${root}/activity`} title="Recent activity" />
        {activities ? (
          <ActivityTimeline compact items={activities} />
        ) : (
          <div className="mt-4">
            <NotificationSkeleton compact />
          </div>
        )}
      </div>
    </section>
  );
}
function FeedHeader({ title, href, count }: { title: string; href: string; count?: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <FiBell className="text-rose-600" />
        <h2 className="font-bold">{title}</h2>
        {count ? (
          <span className="grid min-w-6 place-items-center rounded-full bg-rose-600 px-1.5 text-xs font-bold text-white">
            {count}
          </span>
        ) : null}
      </div>
      <Link
        aria-label={`View ${title}`}
        className="grid size-8 place-items-center rounded-md hover:bg-slate-100 dark:hover:bg-white/10"
        to={href}
      >
        <FiChevronRight />
      </Link>
    </div>
  );
}
