import apiClient, { unwrap } from "@/lib/api-client";

export interface Trade {
  _id: string;
  name: string;
  slug: string;
  subcategories: Array<{ name: string; slug: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export const tradesService = {
  async getAll(): Promise<Trade[]> {
    const res = await apiClient.get("/trades");
    return unwrap(res);
  },

  async getById(id: string): Promise<Trade> {
    const res = await apiClient.get(`/trades/${id}`);
    return unwrap(res);
  },

  async create(name: string): Promise<Trade> {
    const res = await apiClient.post("/trades", { name });
    return unwrap(res);
  },

  async update(id: string, name: string): Promise<Trade> {
    const res = await apiClient.patch(`/trades/${id}`, { name });
    return unwrap(res);
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/trades/${id}`);
  },

  async addSubcategory(tradeId: string, name: string): Promise<Trade> {
    const res = await apiClient.post(`/trades/${tradeId}/subcategories`, {
      name,
    });
    return unwrap(res);
  },

  async removeSubcategory(
    tradeId: string,
    slug: string
  ): Promise<Trade> {
    const res = await apiClient.delete(
      `/trades/${tradeId}/subcategories/${encodeURIComponent(slug)}`
    );
    return unwrap(res);
  },
};
