import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <span className="text-lg font-semibold text-foreground">
              Ainfinite<span className="text-accent">.</span>
            </span>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Building the future of artificial intelligence through innovation and expertise.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Divisions</h4>
            <div className="flex flex-col gap-2">
              <Link to="/labs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Ainfinite Labs
              </Link>
              <Link to="/consulting" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Ainfinite AI
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4">Company</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <a href="mailto:hello@ainfinite.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Ainfinite Ventures LLP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
