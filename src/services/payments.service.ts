import apiClient, { unwrap } from "@/lib/api-client";

export interface SubscriptionStatus {
  plan: string | null;
  status: string | null;
  expiresAt: string | null;
  hasQualificationUpgrade: boolean;
}

export interface TransactionRecord {
  _id: string;
  type: "subscription" | "qualification_upgrade" | "job_payment";
  userId: string;
  listingId?: { _id: string; title: string; category: string } | string;
  contractorId?: { _id: string; name: string; trade: string } | string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "escrow" | "released" | "refunded" | "failed";
  stripeSessionId?: string;
  createdAt: string;
}

export interface ContractorEarnings {
  transactions: TransactionRecord[];
  totalEarned: number;
  pendingEscrow: number;
}

export const paymentsService = {
  async createSubscription(plan: "standard" | "premium"): Promise<{ url: string }> {
    const res = await apiClient.post("/payments/create-subscription", { plan });
    return unwrap(res);
  },

  async upgradeQualification(): Promise<{ url: string }> {
    const res = await apiClient.post("/payments/upgrade-qualification");
    return unwrap(res);
  },

  async createJobPayment(data: { listingId: string; contractorId: string; amount: number }): Promise<{ url: string }> {
    const res = await apiClient.post("/payments/create-job-payment", data);
    return unwrap(res);
  },

  async releaseJobPayment(transactionId: string): Promise<unknown> {
    const res = await apiClient.post("/payments/release-job-payment", { transactionId });
    return unwrap(res);
  },

  async getMyTransactions(): Promise<TransactionRecord[]> {
    const res = await apiClient.get("/payments/my-transactions");
    return unwrap(res);
  },

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    const res = await apiClient.get("/payments/subscription-status");
    return unwrap(res);
  },

  async getContractorEarnings(): Promise<ContractorEarnings> {
    const res = await apiClient.get("/payments/contractor-earnings");
    return unwrap(res);
  },
};
