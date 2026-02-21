import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService, type ContractorSearchParams } from "@/services/users.service";
import { listingsService, type ListingSearchParams, type CreateListingData } from "@/services/listings.service";
import { applicationsService, type CreateApplicationData } from "@/services/applications.service";
import { reviewsService, type CreateReviewData } from "@/services/reviews.service";
import { adminService } from "@/services/admin.service";
import { paymentsService } from "@/services/payments.service";
import { categoriesService } from "@/services/categories.service";
import { authService } from "@/services/auth.service";

// ── Contractors / Users ──
export function useContractors(params: ContractorSearchParams = {}) {
  return useQuery({
    queryKey: ["contractors", params],
    queryFn: () => usersService.getContractors(params),
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => usersService.getUserById(id!),
    enabled: !!id,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      usersService.updateProfile(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["user", vars.id] });
      qc.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(data),
  });
}

export function useSavedContractors() {
  return useQuery({
    queryKey: ["saved-contractors"],
    queryFn: () => usersService.getSavedContractors(),
  });
}

export function useSaveContractor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contractorId: string) => usersService.saveContractor(contractorId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-contractors"] });
      qc.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });
}

export function useUnsaveContractor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (contractorId: string) => usersService.unsaveContractor(contractorId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved-contractors"] });
      qc.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });
}

// ── Listings ──
export function useListings(params: ListingSearchParams = {}) {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => listingsService.getAll(params),
  });
}

export function useMyListings(status?: string) {
  return useQuery({
    queryKey: ["my-listings", status],
    queryFn: () => listingsService.getMyListings(status),
  });
}

export function useListing(id: string | undefined) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingsService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateListingData) => listingsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["listings"] });
      qc.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}

export function useUpdateListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      listingsService.update(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["listing", vars.id] });
      qc.invalidateQueries({ queryKey: ["listings"] });
      qc.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}

export function useDeleteListing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => listingsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["listings"] });
      qc.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
}

// ── Applications ──
export function useMyApplications() {
  return useQuery({
    queryKey: ["my-applications"],
    queryFn: () => applicationsService.getMyApplications(),
  });
}

export function useListingApplications(listingId: string | undefined) {
  return useQuery({
    queryKey: ["listing-applications", listingId],
    queryFn: () => applicationsService.getByListing(listingId!),
    enabled: !!listingId,
  });
}

export function useCreateApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateApplicationData) => applicationsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-applications"] });
      qc.invalidateQueries({ queryKey: ["listing-applications"] });
      qc.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      applicationsService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-applications"] });
      qc.invalidateQueries({ queryKey: ["listing-applications"] });
    },
  });
}

export function useDeleteApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-applications"] });
      qc.invalidateQueries({ queryKey: ["listing-applications"] });
    },
  });
}

// ── Reviews ──
export function useUserReviews(userId: string | undefined, page = 1) {
  return useQuery({
    queryKey: ["reviews", userId, page],
    queryFn: () => reviewsService.getByUser(userId!, page),
    enabled: !!userId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewData) => reviewsService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

// ── Admin ──
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.getStats(),
  });
}

export function useAdminUsers(params: { page?: number; limit?: number; search?: string; role?: string } = {}) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => adminService.getUsers(params),
  });
}

export function useAdminListings(params: { page?: number; limit?: number; status?: string } = {}) {
  return useQuery({
    queryKey: ["admin-listings", params],
    queryFn: () => adminService.getListings(params),
  });
}

export function useSetUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminService.setUserStatus(id, isActive),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useSetUserVerified() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) =>
      adminService.setUserVerified(id, isVerified),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useSetSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, plan }: { id: string; status: string | null; plan: string | null }) =>
      adminService.setSubscription(id, status, plan),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useAdminDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useAdminApplications(params: { page?: number; limit?: number; status?: string } = {}) {
  return useQuery({
    queryKey: ["admin-applications", params],
    queryFn: () => adminService.getApplications(params),
  });
}

export function useAdminTransactions(params: { page?: number; limit?: number; type?: string; status?: string } = {}) {
  return useQuery({
    queryKey: ["admin-transactions", params],
    queryFn: () => adminService.getTransactions(params),
  });
}

export function useAdminReviews(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["admin-reviews", params],
    queryFn: () => adminService.getReviews(params),
  });
}

export function useAdminRemoveProfileImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => adminService.removeUserProfileImage(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useAdminDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminService.deleteReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useUploadProfileImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => usersService.uploadProfileImage(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });
}

export function useDeleteProfileImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => usersService.deleteProfileImage(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });
}

export function useToggleAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => usersService.toggleAvailability(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth-user"] });
      qc.invalidateQueries({ queryKey: ["contractors"] });
    },
  });
}

// ── Payments ──
export function useSubscriptionStatus() {
  return useQuery({
    queryKey: ["subscription-status"],
    queryFn: () => paymentsService.getSubscriptionStatus(),
  });
}

export function useMyTransactions() {
  return useQuery({
    queryKey: ["my-transactions"],
    queryFn: () => paymentsService.getMyTransactions(),
  });
}

export function useCreateSubscription() {
  return useMutation({
    mutationFn: (plan: "standard" | "premium") => paymentsService.createSubscription(plan),
  });
}

export function useUpgradeQualification() {
  return useMutation({
    mutationFn: () => paymentsService.upgradeQualification(),
  });
}

export function useCreateJobPayment() {
  return useMutation({
    mutationFn: (data: { listingId: string; contractorId: string; amount: number }) =>
      paymentsService.createJobPayment(data),
  });
}

export function useReleaseJobPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) => paymentsService.releaseJobPayment(transactionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-transactions"] });
    },
  });
}

export function useContractorEarnings() {
  return useQuery({
    queryKey: ["contractor-earnings"],
    queryFn: () => paymentsService.getContractorEarnings(),
  });
}

// ── Categories ──
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getActive(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useAllCategories() {
  return useQuery({
    queryKey: ["categories-all"],
    queryFn: () => categoriesService.getAll(),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; icon?: string; iconFile?: File }) =>
      categoriesService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["categories-all"] });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; icon?: string; isActive?: boolean; iconFile?: File };
    }) => categoriesService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["categories-all"] });
    },
  });
}

export function useRemoveCategoryIcon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesService.removeIcon(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["categories-all"] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["categories-all"] });
    },
  });
}
