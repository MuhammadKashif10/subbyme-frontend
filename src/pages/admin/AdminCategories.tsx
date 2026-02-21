import { useState, useRef } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { adminNavItems } from "./AdminOverview";
import {
  useAllCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useRemoveCategoryIcon,
} from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getApiError } from "@/context/AuthContext";
import { Plus, Pencil, Trash2, Loader2, X, Check, Upload, ImageOff } from "lucide-react";

export default function AdminCategories() {
  const { data: categories, isLoading } = useAllCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const removeCategoryIcon = useRemoveCategoryIcon();
  const { toast } = useToast();

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIconFile, setNewIconFile] = useState<File | null>(null);
  const [newIconPreview, setNewIconPreview] = useState<string | null>(null);
  const addFileRef = useRef<HTMLInputElement>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIconFile, setEditIconFile] = useState<File | null>(null);
  const [editIconPreview, setEditIconPreview] = useState<string | null>(null);
  const editFileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    file: File | undefined,
    setFile: (f: File | null) => void,
    setPreview: (p: string | null) => void,
  ) => {
    if (!file) return;
    if (file.type !== "image/svg+xml") {
      toast({ title: "Invalid file", description: "Only SVG files are allowed.", variant: "destructive" });
      return;
    }
    if (file.size > 500 * 1024) {
      toast({ title: "File too large", description: "SVG must be under 500KB.", variant: "destructive" });
      return;
    }
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const resetAddForm = () => {
    setNewName("");
    setNewIconFile(null);
    setNewIconPreview(null);
    if (addFileRef.current) addFileRef.current.value = "";
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createCategory.mutateAsync({
        name: newName.trim(),
        iconFile: newIconFile || undefined,
      });
      toast({ title: "Created", description: `Category "${newName}" added` });
      resetAddForm();
      setShowAdd(false);
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await updateCategory.mutateAsync({
        id,
        data: {
          name: editName.trim(),
          iconFile: editIconFile || undefined,
        },
      });
      toast({ title: "Updated", description: "Category updated" });
      setEditId(null);
      setEditIconFile(null);
      setEditIconPreview(null);
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateCategory.mutateAsync({ id, data: { isActive: !isActive } });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    try {
      await deleteCategory.mutateAsync(id);
      toast({ title: "Deleted", description: `Category "${name}" removed` });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const handleRemoveIcon = async (id: string) => {
    try {
      await removeCategoryIcon.mutateAsync(id);
      toast({ title: "Icon removed" });
    } catch (error) {
      toast({ title: "Error", description: getApiError(error), variant: "destructive" });
    }
  };

  const startEdit = (cat: { _id: string; name: string; iconImage?: { public_id: string; url: string } | null }) => {
    setEditId(cat._id);
    setEditName(cat.name);
    setEditIconFile(null);
    setEditIconPreview(cat.iconImage?.url || null);
  };

  const renderIconPreview = (url: string | null, size = "h-10 w-10") => {
    if (!url) return <div className={`${size} rounded bg-muted flex items-center justify-center text-muted-foreground`}><ImageOff size={16} /></div>;
    return <img src={url} alt="Icon" className={`${size} rounded bg-muted object-contain p-1`} />;
  };

  return (
    <AdminLayout navItems={adminNavItems}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Categories Management</h2>
        <Button size="sm" onClick={() => { setShowAdd(!showAdd); if (showAdd) resetAddForm(); }}>
          {showAdd ? <X size={16} className="mr-1" /> : <Plus size={16} className="mr-1" />}
          {showAdd ? "Cancel" : "Add Category"}
        </Button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="mb-6 rounded-lg border bg-card p-5 card-shadow">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
            <div className="space-y-1">
              <Label>Category Name</Label>
              <Input
                placeholder="e.g. Plumbing"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Icon (SVG file)</Label>
              <div className="flex items-center gap-2">
                {renderIconPreview(newIconPreview, "h-9 w-9")}
                <input
                  ref={addFileRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  className="hidden"
                  onChange={(e) =>
                    handleFileSelect(e.target.files?.[0], setNewIconFile, setNewIconPreview)
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addFileRef.current?.click()}
                >
                  <Upload size={14} className="mr-1" />
                  {newIconFile ? "Change" : "Upload"}
                </Button>
                {newIconFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => { setNewIconFile(null); setNewIconPreview(null); if (addFileRef.current) addFileRef.current.value = ""; }}
                  >
                    <X size={14} />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={createCategory.isPending}>
                {createCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add
              </Button>
            </div>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !categories || categories.length === 0 ? (
        <div className="rounded-lg border bg-card p-12 text-center card-shadow">
          <p className="text-muted-foreground">No categories yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat._id} className="rounded-lg border bg-card p-4 card-shadow">
              {editId === cat._id ? (
                <div className="space-y-3">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Name"
                  />
                  <div className="flex items-center gap-2">
                    {renderIconPreview(editIconPreview, "h-9 w-9")}
                    <input
                      ref={editFileRef}
                      type="file"
                      accept=".svg,image/svg+xml"
                      className="hidden"
                      onChange={(e) =>
                        handleFileSelect(e.target.files?.[0], setEditIconFile, setEditIconPreview)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => editFileRef.current?.click()}
                    >
                      <Upload size={14} className="mr-1" />
                      {editIconFile ? "Change" : "Upload SVG"}
                    </Button>
                    {editIconFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditIconFile(null);
                          setEditIconPreview(cat.iconImage?.url || null);
                          if (editFileRef.current) editFileRef.current.value = "";
                        }}
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(cat._id)}
                      disabled={updateCategory.isPending}
                    >
                      {updateCategory.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check size={14} className="mr-1" />
                      )}
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {cat.iconImage?.url ? (
                      <img
                        src={cat.iconImage.url}
                        alt={cat.name}
                        className="h-10 w-10 rounded bg-muted object-contain p-1"
                      />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xl">
                        {cat.icon || "📦"}
                      </span>
                    )}
                    <div>
                      <p className="font-medium text-foreground">{cat.name}</p>
                      <Badge
                        variant={cat.isActive ? "default" : "outline"}
                        className="mt-0.5 text-xs"
                      >
                        {cat.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={cat.isActive}
                      onCheckedChange={() => handleToggleActive(cat._id, cat.isActive)}
                      aria-label="Toggle active"
                    />
                    {cat.iconImage && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveIcon(cat._id)}
                        title="Remove icon"
                      >
                        <ImageOff size={14} className="text-muted-foreground" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => startEdit(cat)}>
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cat._id, cat.name)}
                    >
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
