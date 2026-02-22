import apiClient, { unwrap } from "@/lib/api-client";

export interface Conversation {
  _id: string;
  participants: unknown[];
  jobId?: { _id: string; title?: string; status?: string } | null;
  lastMessage: string;
  lastMessageAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateConversationData {
  participantId: string;
  jobId?: string;
}

export const conversationsService = {
  async create(data: CreateConversationData): Promise<Conversation> {
    const res = await apiClient.post("/conversations", data);
    return unwrap(res);
  },

  async getMine(page = 1, limit = 20): Promise<{
    conversations: Conversation[];
    total: number;
    page: number;
    limit: number;
  }> {
    const res = await apiClient.get("/conversations", {
      params: { page, limit },
    });
    return unwrap(res);
  },

  async getById(id: string): Promise<Conversation> {
    const res = await apiClient.get(`/conversations/${id}`);
    return unwrap(res);
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const res = await apiClient.get("/conversations/unread-count");
    return unwrap(res);
  },
};
