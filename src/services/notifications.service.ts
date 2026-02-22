import apiClient, { unwrap } from "@/lib/api-client";

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  message: string;
  relatedId?: string | null;
  read: boolean;
  createdAt: string;
}

export const notificationsService = {
  async getMine(
    page = 1,
    limit = 20
  ): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
    page: number;
    limit: number;
  }> {
    const res = await apiClient.get("/notifications", {
      params: { page, limit },
    });
    return unwrap(res);
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const res = await apiClient.get("/notifications/unread-count");
    return unwrap(res);
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.post(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post("/notifications/read-all");
  },
};
