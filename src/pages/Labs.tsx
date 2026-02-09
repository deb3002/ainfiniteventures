import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/FadeIn";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

const ProductCard = ({ product }: { product: Product }) => {
  const [imgError, setImgError] = useState(false);
  const thumbUrl = product.thumbnail_url || `https://image.thum.io/get/width/600/${product.url}`;

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col h-full rounded-2xl border border-border bg-card hover:border-accent/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-secondary overflow-hidden">
        {!imgError ? (
          <img
            src={thumbUrl}
            alt={`${product.name} preview`}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <span className="text-3xl font-bold text-muted-foreground/40">
              {product.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 mb-2">
          {product.logo_url && (
            <img
              src={product.logo_url}
              alt=""
              className="h-6 w-6 rounded-md object-cover"
            />
          )}
          <h3 className="text-lg font-semibold text-card-foreground">
            {product.name}
          </h3>
          {product.tag && (
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-accent/10 text-accent">
              {product.tag}
            </span>
          )}
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
          Visit <ExternalLink size={14} />
        </div>
      </div>
    </a>
  );
};

const Labs = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="text-sm font-medium text-accent tracking-widest uppercase mb-6">
              Ainfinite Labs
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1] text-balance">
              Consumer AI products that people love
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              We design and build AI-powered tools that are intuitive, 
              delightful, and genuinely useful.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading products…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <FadeIn key={product.id} delay={i * 0.1}>
                  <ProductCard product={product} />
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Labs;
