import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { ContactSubmissionsTab } from "@/components/admin/ContactSubmissionsTab";

const AdminDashboard = () => {
  const { isAdmin, signOut } = useAuth();

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
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-3xl font-semibold text-foreground">Admin Dashboard</h1>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut size={16} />
              </Button>
            </div>
          </FadeIn>

          <Tabs defaultValue="products">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="submissions">Contact Submissions</TabsTrigger>
            </TabsList>
            <TabsContent value="products">
              <ProductsTab />
            </TabsContent>
            <TabsContent value="submissions">
              <ContactSubmissionsTab />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
