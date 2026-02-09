import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/FadeIn";
import { ExternalLink } from "lucide-react";

// ────────────────────────────────────────
// ADD NEW PRODUCTS HERE
// Each product needs: name, description, url, and optionally a logoUrl
// ────────────────────────────────────────
interface Product {
  name: string;
  description: string;
  url: string;
  logoUrl?: string;
  /** Short tag like "Beta", "New", etc. */
  tag?: string;
}

const products: Product[] = [
  {
    name: "Product One",
    description:
      "An intelligent assistant that understands context and helps you work smarter, not harder.",
    url: "https://example.com",
    tag: "Coming Soon",
  },
  {
    name: "Product Two",
    description:
      "AI-powered analytics that turn raw data into actionable insights in seconds.",
    url: "https://example.com",
    tag: "Beta",
  },
  {
    name: "Product Three",
    description:
      "Natural language interfaces that make complex systems accessible to everyone.",
    url: "https://example.com",
  },
];

const Labs = () => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <FadeIn key={product.name} delay={i * 0.1}>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between h-full p-8 rounded-2xl border border-border bg-card hover:border-accent/30 transition-all duration-300"
                >
                  <div>
                    {/* Logo or fallback initial */}
                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-6 overflow-hidden">
                      {product.logoUrl ? (
                        <img
                          src={product.logoUrl}
                          alt={`${product.name} logo`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-foreground">
                          {product.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-card-foreground">
                        {product.name}
                      </h3>
                      {product.tag && (
                        <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                          {product.tag}
                        </span>
                      )}
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
                    Visit <ExternalLink size={14} />
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Labs;
