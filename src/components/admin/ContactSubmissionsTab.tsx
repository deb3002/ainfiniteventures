import { useEffect, useState } from "react";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  query: string | null;
  created_at: string;
}

export function ContactSubmissionsTab() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSubmissions(data);
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return;
    }
    toast({ title: "Submission deleted" });
    fetchSubmissions();
  };

  return (
    <FadeIn delay={0.1}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Query</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.name}</TableCell>
              <TableCell>{s.email}</TableCell>
              <TableCell>{s.phone}</TableCell>
              <TableCell>{s.address}</TableCell>
              <TableCell className="max-w-[200px] truncate">{s.query ?? "—"}</TableCell>
              <TableCell>{format(new Date(s.created_at), "MMM d, yyyy")}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {submissions.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No submissions yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </FadeIn>
  );
}
