import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/FadeIn";
import { HeroAnimation } from "@/components/HeroAnimation";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Users } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden py-32 md:py-48 px-6">
        <HeroAnimation />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeIn>
            <p className="text-sm font-medium text-accent tracking-widest uppercase mb-6">
              Ainfinite Ventures LLP
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.1] text-balance">
              Shaping the future of artificial intelligence
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We build transformative AI products, deliver enterprise-grade AI solutions, and
              bring transparency to sustainability through our ESG disclosure work — all under one roof.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Divisions */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <p className="text-sm font-medium text-accent tracking-widest uppercase mb-4">
              Our Divisions
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-16">
              Two pillars. One mission.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn delay={0.1}>
              <Link
                to="/labs"
                className="group block p-10 md:p-12 rounded-2xl border border-border bg-card hover:border-accent/30 transition-all duration-300"
              >
                <Cpu className="h-8 w-8 text-accent mb-6" />
                <h3 className="text-2xl font-semibold text-card-foreground mb-3">
                  Ainfinite Labs
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Consumer AI products that push boundaries. We design, build, and launch intelligent 
                  tools people love to use every day.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
                  Explore products <ArrowRight size={16} />
                </span>
              </Link>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Link
                to="/consulting"
                className="group block p-10 md:p-12 rounded-2xl border border-border bg-card hover:border-accent/30 transition-all duration-300"
              >
                <Users className="h-8 w-8 text-accent mb-6" />
                <h3 className="text-2xl font-semibold text-card-foreground mb-3">
                  Ainfinite AI
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Enterprise AI consulting and implementation. We help businesses integrate AI 
                  strategically and build custom solutions at scale.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all">
                  Learn more <ArrowRight size={16} />
                </span>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="rounded-2xl bg-primary text-primary-foreground p-12 md:p-20 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-balance">
                Intelligence. Integrity. Impact.
              </h2>
              <p className="text-primary-foreground/70 max-w-xl mx-auto leading-relaxed">
                From ideation to deployment, we bring deep technical expertise and a commitment to
                building AI that creates real value for people and businesses.
              </p>
              <p className="text-primary-foreground/70 max-w-xl mx-auto leading-relaxed mt-6">
                That same commitment extends to how we report on sustainability — openly and
                verifiably, through our ESG disclosure profile.
              </p>
              <Link
                to="/esg"
                className="inline-flex items-center gap-2 mt-8 text-sm font-medium text-accent group-hover:gap-3 transition-all"
              >
                Explore our ESG Disclosure Profile <ArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
