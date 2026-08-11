export type NotificationType =
  | 'application'
  | 'interview'
  | 'moderation'
  | 'recommendation'
  | 'message'
  | 'announcement'
  | 'system';
export type ActivityCategory = 'candidate' | 'company' | 'recruiter' | 'admin' | 'system';

export type NotificationItem = {
  id: string;
  owner_id: string;
  type: NotificationType;
  title: string;
  description: string;
  created_at: string;
  is_read: boolean;
  action_url: string | null;
};

export type NotificationList = {
  notifications: NotificationItem[];
  total: number;
  unread_count: number;
  page: number;
  page_size: number;
};

export type NotificationQuery = {
  type?: NotificationType;
  read?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  occurred_at: string;
  user: string;
  category: ActivityCategory;
  icon: string;
};

export type ActivityFeed = { activities: ActivityItem[]; total: number };
