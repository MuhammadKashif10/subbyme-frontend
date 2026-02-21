import apiClient, { unwrap } from "@/lib/api-client";
import type { Listing } from "@/lib/types";

export interface ListingSearchParams {
  status?: string;
  category?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateListingData {
  title: string;
  description: string;
  category: string;
  location: string;
  budget?: { min: number; max: number; currency?: string };
  skills?: string[];
  urgency?: string;
}

export const listingsService = {
  async getAll(params: ListingSearchParams = {}): Promise<{ listings: Listing[]; total: number; page: number; limit: number }> {
    const res = await apiClient.get("/listings", { params });
    return unwrap(res);
  },

  async getMyListings(status?: string): Promise<Listing[]> {
    const res = await apiClient.get("/listings/my", { params: status ? { status } : {} });
    return unwrap(res);
  },

  async getById(id: string): Promise<Listing> {
    const res = await apiClient.get(`/listings/${id}`);
    return unwrap(res);
  },

  async create(data: CreateListingData): Promise<Listing> {
    const res = await apiClient.post("/listings", data);
    return unwrap(res);
  },

  async update(id: string, data: Partial<CreateListingData> & { status?: string }): Promise<Listing> {
    const res = await apiClient.patch(`/listings/${id}`, data);
    return unwrap(res);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/listings/${id}`);
  },
};
