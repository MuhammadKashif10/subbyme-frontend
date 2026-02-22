import apiClient, { unwrap } from "@/lib/api-client";

export interface Availability {
  _id: string;
  contractorId: string;
  unavailableDates: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const availabilityService = {
  async getMine(): Promise<Availability> {
    const res = await apiClient.get("/availability/me");
    return unwrap(res);
  },

  async addUnavailableDates(dates: string[]): Promise<Availability> {
    const res = await apiClient.post("/availability/me/add", { dates });
    return unwrap(res);
  },

  async removeUnavailableDates(dates: string[]): Promise<Availability> {
    const res = await apiClient.post("/availability/me/remove", { dates });
    return unwrap(res);
  },

  async getByContractor(contractorId: string): Promise<Availability> {
    const res = await apiClient.get(`/availability/contractor/${contractorId}`);
    return unwrap(res);
  },
};
