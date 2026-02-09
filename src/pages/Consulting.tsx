import { Layout } from "@/components/Layout";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRight, Brain, BarChart3, Workflow, Shield } from "lucide-react";

const services = [
  {
    icon: Brain,
    title: "AI Strategy",
    description: "We assess your organization's AI readiness and create a roadmap aligned with your business goals.",
  },
  {
    icon: Workflow,
    title: "Custom Development",
    description: "End-to-end design and development of bespoke AI solutions tailored to your domain.",
  },
  {
    icon: BarChart3,
    title: "Data & Analytics",
    description: "Transform your data infrastructure into an AI-ready platform that drives decisions.",
  },
  {
    icon: Shield,
    title: "AI Governance",
    description: "Responsible AI frameworks, bias auditing, and compliance to ensure ethical deployment.",
  },
];

const process = [
  { step: "01", title: "Discover", description: "Deep-dive into your business, data, and opportunities." },
  { step: "02", title: "Design", description: "Architect solutions that balance ambition with pragmatism." },
  { step: "03", title: "Build", description: "Develop, test, and iterate with speed and precision." },
  { step: "04", title: "Scale", description: "Deploy to production and continuously optimize." },
];

const Consulting = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 md:py-36 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="text-sm font-medium text-accent tracking-widest uppercase mb-6">
              Ainfinite AI
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1] text-balance">
              Enterprise AI consulting & implementation
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              We partner with forward-thinking businesses to design, build, and deploy 
              AI systems that create measurable value.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <p className="text-sm font-medium text-accent tracking-widest uppercase mb-4">
              What We Do
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-16">
              End-to-end AI services
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <FadeIn key={service.title} delay={i * 0.1}>
                <div className="p-8 md:p-10 rounded-2xl border border-border bg-card">
                  <service.icon className="h-7 w-7 text-accent mb-5" />
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <p className="text-sm font-medium text-accent tracking-widest uppercase mb-4">
              Our Process
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-16">
              From insight to impact
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.1}>
                <div>
                  <span className="text-4xl font-semibold text-accent/20">{item.step}</span>
                  <h3 className="text-lg font-semibold text-foreground mt-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="rounded-2xl bg-primary text-primary-foreground p-12 md:p-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-balance">
                  Ready to bring AI into your business?
                </h2>
                <p className="text-primary-foreground/70 max-w-lg leading-relaxed">
                  Let's discuss how we can help you unlock value with artificial intelligence.
                </p>
              </div>
              <a
                href="mailto:hello@ainfinite.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium text-sm hover:opacity-90 transition-opacity shrink-0"
              >
                Get in touch <ArrowRight size={16} />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
};

export default Consulting;
