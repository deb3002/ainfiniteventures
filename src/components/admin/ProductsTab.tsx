import { useEffect, useState, useRef } from "react";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Upload, Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
  logo_url: string | null;
  tag: string | null;
  thumbnail_url: string | null;
  sort_order: number;
}

const emptyProduct = { name: "", description: "", url: "", logo_url: "", tag: "", thumbnail_url: "", sort_order: 0 };

export function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({ variant: "destructive", title: "Invalid file type", description: "Please upload a JPG, PNG, WebP, or GIF image" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 5MB" });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    const fileExt = file.type.split("/")[1];
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("product-thumbnails")
      .upload(fileName, file);

    if (error) {
      toast({ variant: "destructive", title: "Upload failed", description: error.message });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("product-thumbnails")
      .getPublicUrl(fileName);

    setForm((prev) => ({ ...prev, thumbnail_url: publicUrl }));
    setUploading(false);
    toast({ title: "Image uploaded" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("sort_order");
    if (data) setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      url: form.url,
      logo_url: form.logo_url || null,
      tag: form.tag || null,
      thumbnail_url: form.thumbnail_url || null,
      sort_order: form.sort_order,
    };

    const { error } = editingId
      ? await supabase.from("products").update(payload).eq("id", editingId)
      : await supabase.from("products").insert(payload);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return;
    }

    toast({ title: editingId ? "Product updated" : "Product added" });
    setForm(emptyProduct);
    setEditingId(null);
    setShowForm(false);
    fetchProducts();
  };

  const handleEdit = (p: Product) => {
    setForm({
      name: p.name, description: p.description, url: p.url,
      logo_url: p.logo_url ?? "", tag: p.tag ?? "", thumbnail_url: p.thumbnail_url ?? "", sort_order: p.sort_order,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return;
    }
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  return (
    <>
      <div className="flex items-center justify-end mb-6">
        <Button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyProduct); }}
          size="sm"
        >
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {showForm && (
        <FadeIn>
          <div className="mb-10 p-6 rounded-2xl border border-border bg-card space-y-4">
            <h2 className="text-lg font-medium text-foreground">
              {editingId ? "Edit Product" : "New Product"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} placeholder="Custom thumbnail (overrides auto-generated)" />
                <div className="flex items-center gap-2 mt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? <Loader2 size={14} className="animate-spin mr-1" /> : <Upload size={14} className="mr-1" />}
                    {uploading ? "Uploading…" : "Upload image"}
                  </Button>
                  {form.thumbnail_url && (
                    <img src={form.thumbnail_url} alt="Preview" className="h-8 w-8 rounded object-cover border border-border" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tag</Label>
                <Input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="e.g. Beta, New" />
              </div>
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave}>{editingId ? "Update" : "Add"}</Button>
              <Button variant="ghost" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyProduct); }}>
                Cancel
              </Button>
            </div>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.1}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.tag ?? "—"}</TableCell>
                <TableCell>{p.sort_order}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}>
                    <Pencil size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No products yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </FadeIn>
    </>
  );
}
