import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FiBell, FiCheck, FiSearch, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { NotificationSkeleton } from '@/components/Notifications/NotificationSkeleton';
import { notificationService } from '@/services/notificationService';
import type { NotificationItem, NotificationList, NotificationType } from '@/types/notifications';

const types: Array<{ value: '' | NotificationType; label: string }> = [
  { value: '', label: 'All types' },
  { value: 'application', label: 'Applications' },
  { value: 'interview', label: 'Interviews' },
  { value: 'moderation', label: 'Moderation' },
  { value: 'recommendation', label: 'Recommendations' },
  { value: 'message', label: 'Messages' },
  { value: 'announcement', label: 'Announcements' },
  { value: 'system', label: 'System' },
];

export function NotificationCenterPage() {
  const root = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<NotificationList>();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'' | NotificationType>('');
  const [read, setRead] = useState<'all' | 'read' | 'unread'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  useEffect(() => {
    const context = gsap.context(
      () => gsap.from('[data-notification-header]', { opacity: 0, y: 14, duration: 0.45 }),
      root,
    );
    return () => context.revert();
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void notificationService
        .getNotifications({
          search,
          type: type || undefined,
          read: read === 'all' ? undefined : read === 'read',
          page,
          page_size: pageSize,
        })
        .then(setData)
        .catch(() => toast.error('Unable to load notifications.'));
    }, 180);
    return () => window.clearTimeout(timer);
  }, [page, read, search, type]);
  function updateItem(id: string, change: (item: NotificationItem) => NotificationItem | null) {
    setData((current) =>
      current
        ? {
            ...current,
            notifications: current.notifications
              .map((item) => (item.id === id ? change(item) : item))
              .filter((item): item is NotificationItem => item !== null),
            unread_count: Math.max(
              0,
              current.unread_count -
                (current.notifications.find((item) => item.id === id && !item.is_read) ? 1 : 0),
            ),
            total: change === null ? current.total - 1 : current.total,
          }
        : current,
    );
  }
  async function markRead(item: NotificationItem) {
    await notificationService.markRead(item.id);
    updateItem(item.id, (current) => ({ ...current, is_read: true }));
    toast.success('Notification marked as read.');
  }
  async function remove(item: NotificationItem) {
    await notificationService.delete(item.id);
    setData((current) =>
      current
        ? {
            ...current,
            notifications: current.notifications.filter(({ id }) => id !== item.id),
            total: current.total - 1,
            unread_count: current.unread_count - (item.is_read ? 0 : 1),
          }
        : current,
    );
    toast.success('Notification deleted.');
  }
  async function markAll() {
    await notificationService.markAllRead();
    setData((current) =>
      current
        ? {
            ...current,
            unread_count: 0,
            notifications: current.notifications.map((item) => ({ ...item, is_read: true })),
          }
        : current,
    );
    toast.success('All notifications marked as read.');
  }
  async function clearAll() {
    await notificationService.clear();
    setData((current) =>
      current ? { ...current, notifications: [], total: 0, unread_count: 0 } : current,
    );
    toast.success('Notifications cleared.');
  }
  const pages = Math.max(1, Math.ceil((data?.total ?? 0) / pageSize));
  return (
    <div className="mt-6 space-y-5" ref={root}>
      <header
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        data-notification-header
      >
        <div>
          <p className="text-sm font-bold uppercase text-rose-600">Notification center</p>
          <h1 className="mt-2 text-3xl font-bold">Stay current</h1>
          <p className="mt-2 text-slate-500">
            Manage account updates, workflow alerts, and platform messages.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-bold dark:border-white/15"
            onClick={markAll}
          >
            <FiCheck />
            Mark all read
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md border border-rose-200 px-3 text-sm font-bold text-rose-600"
            onClick={clearAll}
          >
            <FiTrash2 />
            Clear all
          </button>
        </div>
      </header>
      <section className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto_auto] dark:border-white/10 dark:bg-slate-900/70">
        <label className="relative">
          <FiSearch className="absolute left-3 top-3 text-slate-400" />
          <input
            aria-label="Search notifications"
            className="h-10 w-full rounded-md border border-slate-300 bg-transparent pl-9 pr-3 text-sm outline-none focus:border-cyan-500 dark:border-white/15"
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search notifications"
            value={search}
          />
        </label>
        <select
          aria-label="Filter notification type"
          className="h-10 rounded-md border border-slate-300 bg-transparent px-3 text-sm dark:border-white/15"
          onChange={(event) => {
            setType(event.target.value as '' | NotificationType);
            setPage(1);
          }}
          value={type}
        >
          {types.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter read status"
          className="h-10 rounded-md border border-slate-300 bg-transparent px-3 text-sm dark:border-white/15"
          onChange={(event) => {
            setRead(event.target.value as typeof read);
            setPage(1);
          }}
          value={read}
        >
          <option value="all">All status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </section>
      {!data ? (
        <NotificationSkeleton />
      ) : data.notifications.length ? (
        <section className="space-y-3">
          {data.notifications.map((item, index) => (
            <motion.article
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg border p-4 shadow-sm ${item.is_read ? 'border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/70' : 'border-cyan-200 bg-cyan-50/60 dark:border-cyan-300/20 dark:bg-cyan-300/5'}`}
              initial={{ opacity: 0, y: 10 }}
              key={item.id}
              transition={{ delay: index * 0.04 }}
            >
              <div className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-white text-cyan-700 shadow-sm dark:bg-white/10 dark:text-cyan-300">
                  <FiBell />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h2 className="font-bold">{item.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {item.description}
                      </p>
                    </div>
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold capitalize text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {item.type}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <time className="text-xs text-slate-500">
                      {new Date(item.created_at).toLocaleString()}
                    </time>
                    {item.action_url ? (
                      <Link
                        className="text-xs font-bold text-cyan-700 dark:text-cyan-300"
                        to={item.action_url}
                      >
                        Open update
                      </Link>
                    ) : null}
                    <div className="ml-auto flex gap-1">
                      {!item.is_read ? (
                        <button
                          aria-label={`Mark ${item.title} as read`}
                          className="grid size-8 place-items-center rounded-md hover:bg-white dark:hover:bg-white/10"
                          onClick={() => void markRead(item)}
                        >
                          <FiCheck />
                        </button>
                      ) : null}
                      <button
                        aria-label={`Delete ${item.title}`}
                        className="grid size-8 place-items-center rounded-md text-rose-600 hover:bg-white dark:hover:bg-white/10"
                        onClick={() => void remove(item)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </section>
      ) : (
        <section className="rounded-lg border border-dashed border-slate-300 py-16 text-center dark:border-white/15">
          <FiBell className="mx-auto size-9 text-slate-400" />
          <h2 className="mt-3 font-bold">No notifications found</h2>
          <p className="mt-1 text-sm text-slate-500">Try changing the active filters.</p>
        </section>
      )}
      <footer className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {data?.unread_count ?? 0} unread / {data?.total ?? 0} results
        </p>
        <div className="flex items-center gap-2">
          <button
            className="h-9 rounded-md border px-3 text-sm disabled:opacity-40 dark:border-white/15"
            disabled={page === 1}
            onClick={() => setPage((value) => value - 1)}
          >
            Previous
          </button>
          <span className="text-sm font-bold">
            {page} / {pages}
          </span>
          <button
            className="h-9 rounded-md border px-3 text-sm disabled:opacity-40 dark:border-white/15"
            disabled={page >= pages}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </button>
        </div>
      </footer>
    </div>
  );
}
