import apiClient, { unwrap } from "@/lib/api-client";
import type { Application } from "@/lib/types";

export interface CreateApplicationData {
  listingId: string;
  coverLetter: string;
  proposedRate?: number;
  proposedTimeline?: string;
}

export const applicationsService = {
  async create(data: CreateApplicationData): Promise<Application> {
    const res = await apiClient.post("/applications", data);
    return unwrap(res);
  },

  async getMyApplications(): Promise<Application[]> {
    const res = await apiClient.get("/applications/my");
    return unwrap(res);
  },

  async getByListing(listingId: string): Promise<Application[]> {
    const res = await apiClient.get(`/applications/listing/${listingId}`);
    return unwrap(res);
  },

  async getById(id: string): Promise<Application> {
    const res = await apiClient.get(`/applications/${id}`);
    return unwrap(res);
  },

  async updateStatus(id: string, status: string): Promise<Application> {
    const res = await apiClient.patch(`/applications/${id}`, { status });
    return unwrap(res);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/applications/${id}`);
  },
};
