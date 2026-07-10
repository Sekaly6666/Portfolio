import { HardHat, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8 print:hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight mb-4">
              <HardHat className="text-accent h-6 w-6" />
              <span>Cissé Ibrahim <span className="text-primary">Matche</span></span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Technicien Supérieur en Génie Civil.
              Expert en métré, suivi de chantier et contrôle qualité en Côte d'Ivoire.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/projets" className="text-muted-foreground hover:text-accent text-sm">Projets</Link></li>
              <li><Link href="/plans" className="text-muted-foreground hover:text-accent text-sm">Plans</Link></li>
              <li><Link href="/mediatheque" className="text-muted-foreground hover:text-accent text-sm">Médiathèque</Link></li>
              <li><Link href="/cv" className="text-muted-foreground hover:text-accent text-sm">Mon CV</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 text-accent" />
                Abidjan, Côte d'Ivoire
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="h-4 w-4 text-accent" />
                +225 07 77 25 31 37
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="h-4 w-4 text-accent" />
                cissei931brahim@gmail.com
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Légal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-accent text-sm">Mentions légales</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent text-sm">Politique de confidentialité</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ibrahim Matche Cissé. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground font-mono">BTP // GENIE CIVIL // CI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
