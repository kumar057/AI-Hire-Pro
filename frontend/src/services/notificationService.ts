import { apiClient } from '@/services/apiClient';
import type { ActivityFeed, NotificationList, NotificationQuery } from '@/types/notifications';

type MutationResponse = { id?: string; status: 'read' | 'deleted' | 'cleared'; message: string };

export const notificationService = {
  async getNotifications(query: NotificationQuery = {}) {
    return (await apiClient.get<NotificationList>('/notifications', { params: query })).data;
  },
  async markRead(id: string) {
    return (await apiClient.patch<MutationResponse>(`/notifications/${id}/read`)).data;
  },
  async markAllRead() {
    return (await apiClient.patch<MutationResponse>('/notifications/read-all')).data;
  },
  async delete(id: string) {
    return (await apiClient.delete<MutationResponse>(`/notifications/${id}`)).data;
  },
  async clear() {
    return (await apiClient.delete<MutationResponse>('/notifications')).data;
  },
  async getActivity() {
    return (await apiClient.get<ActivityFeed>('/activity-feed')).data;
  },
};
