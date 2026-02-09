import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, LogOut } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
  logo_url: string | null;
  tag: string | null;
  sort_order: number;
}

const emptyProduct = { name: "", description: "", url: "", logo_url: "", tag: "", sort_order: 0 };

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { isAdmin, signOut } = useAuth();
  const { toast } = useToast();

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("sort_order");
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
      name: p.name,
      description: p.description,
      url: p.url,
      logo_url: p.logo_url ?? "",
      tag: p.tag ?? "",
      sort_order: p.sort_order,
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

  if (!isAdmin) {
    return (
      <Layout>
        <section className="py-24 px-6 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have admin privileges.</p>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-3xl font-semibold text-foreground">Manage Products</h1>
              <div className="flex gap-3">
                <Button
                  onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyProduct); }}
                  size="sm"
                >
                  <Plus size={16} /> Add Product
                </Button>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut size={16} />
                </Button>
              </div>
            </div>
          </FadeIn>

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
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
