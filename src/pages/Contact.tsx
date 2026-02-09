import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Send } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone number is required").max(20),
  address: z.string().trim().min(1, "Address is required").max(500),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    });
    setSubmitting(false);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong. Please try again." });
      return;
    }

    toast({ title: "Message sent!", description: "We'll get back to you soon." });
    reset();
  };

  return (
    <Layout>
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <p className="text-sm font-medium text-accent tracking-widest uppercase mb-6">
              Contact
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground leading-[1.1] text-balance">
              Let's connect
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-12 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your full name" {...register("name")} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+1 (555) 000-0000" {...register("phone")} />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="City, Country" {...register("address")} />
                  {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                <Send size={16} />
                {submitting ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
