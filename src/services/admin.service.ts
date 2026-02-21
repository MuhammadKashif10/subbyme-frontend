import apiClient, { unwrap } from "@/lib/api-client";
import type { User, Listing, Application, Review } from "@/lib/types";
import type { TransactionRecord } from "@/services/payments.service";

export interface AdminStats {
  users: { total: number; client: number; contractor: number; admin: number };
  listings: { total: number; byStatus: Record<string, number> };
  subscriptions: { active: number; trialing: number; expired: number; total: number };
  applications: { total: number; byStatus: Record<string, number> };
  revenue: { total: number; transactionCount: number };
  reviews: { total: number };
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const res = await apiClient.get("/admin/stats");
    return unwrap(res);
  },

  async getUsers(params: { page?: number; limit?: number; search?: string; role?: string } = {}): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    const res = await apiClient.get("/admin/users", { params });
    return unwrap(res);
  },

  async setUserStatus(id: string, isActive: boolean): Promise<User> {
    const res = await apiClient.patch(`/admin/users/${id}/status`, { isActive });
    return unwrap(res);
  },

  async setUserVerified(id: string, isVerified: boolean): Promise<User> {
    const res = await apiClient.patch(`/admin/users/${id}/verify`, { isVerified });
    return unwrap(res);
  },

  async setSubscription(id: string, status: string | null, plan: string | null): Promise<User> {
    const res = await apiClient.patch(`/admin/users/${id}/subscription`, { status, plan });
    return unwrap(res);
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`);
  },

  async getListings(params: { page?: number; limit?: number; status?: string } = {}): Promise<{ listings: Listing[]; total: number; page: number; limit: number }> {
    const res = await apiClient.get("/admin/listings", { params });
    return unwrap(res);
  },

  async getApplications(params: { page?: number; limit?: number; status?: string } = {}): Promise<{ applications: Application[]; total: number; page: number; limit: number }> {
    const res = await apiClient.get("/admin/applications", { params });
    return unwrap(res);
  },

  async getTransactions(params: { page?: number; limit?: number; type?: string; status?: string } = {}): Promise<{ transactions: TransactionRecord[]; total: number; page: number; limit: number }> {
    const res = await apiClient.get("/admin/transactions", { params });
    return unwrap(res);
  },

  async getReviews(params: { page?: number; limit?: number } = {}): Promise<{ reviews: Review[]; total: number; page: number; limit: number }> {
    const res = await apiClient.get("/admin/reviews", { params });
    return unwrap(res);
  },

  async deleteReview(id: string): Promise<void> {
    await apiClient.delete(`/admin/reviews/${id}`);
  },

  async removeUserProfileImage(userId: string): Promise<User> {
    const res = await apiClient.delete(`/admin/users/${userId}/profile-image`);
    return unwrap(res);
  },
};
