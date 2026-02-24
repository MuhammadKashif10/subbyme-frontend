import apiClient, { unwrap } from "@/lib/api-client";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  async submit(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    const res = await apiClient.post("/contact", data);
    return unwrap(res);
  },
};
