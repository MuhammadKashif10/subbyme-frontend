import apiClient, { unwrap } from "@/lib/api-client";

export interface CategoryItem {
  _id: string;
  name: string;
  icon: string;
  iconImage?: { public_id: string; url: string } | null;
  isActive: boolean;
  createdAt?: string;
}

export const categoriesService = {
  async getActive(): Promise<CategoryItem[]> {
    const res = await apiClient.get("/categories");
    return unwrap(res);
  },

  async getAll(): Promise<CategoryItem[]> {
    const res = await apiClient.get("/categories/all");
    return unwrap(res);
  },

  async create(data: { name: string; icon?: string; iconFile?: File }): Promise<CategoryItem> {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.icon) formData.append("icon", data.icon);
    if (data.iconFile) formData.append("icon", data.iconFile);
    const res = await apiClient.post("/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap(res);
  },

  async update(
    id: string,
    data: { name?: string; icon?: string; isActive?: boolean; iconFile?: File },
  ): Promise<CategoryItem> {
    const formData = new FormData();
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.icon !== undefined) formData.append("icon", data.icon);
    if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));
    if (data.iconFile) formData.append("icon", data.iconFile);
    const res = await apiClient.patch(`/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap(res);
  },

  async removeIcon(id: string): Promise<CategoryItem> {
    const res = await apiClient.delete(`/categories/${id}/icon`);
    return unwrap(res);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};
