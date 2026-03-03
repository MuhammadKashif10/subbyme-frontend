import apiClient, { unwrap } from "@/lib/api-client";

export type VerificationDocumentType = "qualification" | "id" | "abn" | "insurance";
export type VerificationDocumentStatus = "pending" | "approved" | "rejected";

export interface VerificationDocument {
  _id: string;
  userId: string;
  type: VerificationDocumentType;
  documentUrl: string;
  status: VerificationDocumentStatus;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  createdAt?: string;
}

export const verificationService = {
  async getMyDocuments(): Promise<VerificationDocument[]> {
    const res = await apiClient.get("/verification/me");
    return unwrap(res);
  },

  async fetchDocumentBlob(docId: string): Promise<{ blob: Blob; mimeType: string }> {
    const res = await apiClient.get(`/verification/document/${docId}`, {
      responseType: "blob",
    });
    const mimeType = res.headers["content-type"] || "application/pdf";
    return { blob: res.data, mimeType };
  },

  async uploadDocument(type: VerificationDocumentType, file: File): Promise<VerificationDocument> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const res = await apiClient.post("/verification/upload", formData);
    return unwrap(res);
  },
};
