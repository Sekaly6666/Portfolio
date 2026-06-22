import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { HardHat, FileText, ArrowRight, ChevronRight, Award, Trophy, Users, Building, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetStats } from "@workspace/api-client-react";

const roles = ["Métreur", "Suivi de Chantier", "Contrôle Qualité", "Technicien Supérieur"];

export default function Home() {
  const [currentRole, setCurrentRole] = useState(0);
  const { data: stats } = useGetStats();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-blueprint z-0 opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
        
        <div className="container relative z-20 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium tracking-wider text-sm"
          >
            DISPONIBLE POUR NOUVEAUX PROJETS
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 text-foreground"
          >
            IBRAHIM <span className="text-primary">MATCHE CISSÉ</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-2xl md:text-4xl font-light text-muted-foreground mb-12 h-[40px] md:h-[48px]"
          >
            Expert en{" "}
            <span className="text-accent font-medium">
              {roles[currentRole]}
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" asChild className="w-full sm:w-auto h-14 px-8 text-lg bg-primary hover:bg-primary/90">
              <Link href="/projets">
                Voir mes projets <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-border hover:bg-card">
              <FileText className="mr-2 h-5 w-5" />
              Télécharger CV
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-bold">À Propos</h2>
              <div className="h-1 w-20 bg-accent"></div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Technicien Supérieur en Génie Civil (Option Bâtiment), je combine rigueur technique et vision globale pour mener à bien des projets de construction d'envergure. Basé à Abidjan, j'interviens sur l'ensemble du cycle de vie du bâtiment.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <span className="px-4 py-2 bg-background border border-border rounded-md text-sm font-mono text-muted-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent"></span> Né le 04 Mars 1999
                </span>
                <span className="px-4 py-2 bg-background border border-border rounded-md text-sm font-mono text-muted-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span> Abidjan, Côte d'Ivoire
                </span>
                <span className="px-4 py-2 bg-background border border-border rounded-md text-sm font-mono text-muted-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Permis B
                </span>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-background border border-border p-8 rounded-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <HardHat className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-bold mb-6 relative z-10">Vision & Valeurs</h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex gap-4">
                  <div className="bg-primary/20 p-3 rounded-lg text-primary h-fit">
                    <PenTool className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Précision</h4>
                    <p className="text-muted-foreground text-sm">Des métrés exacts et un contrôle qualité sans faille pour garantir la pérennité de l'ouvrage.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-accent/20 p-3 rounded-lg text-accent h-fit">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Fiabilité</h4>
                    <p className="text-muted-foreground text-sm">Le respect strict des délais et des normes de sécurité sur chaque chantier supervisé.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Compétences Techniques</h2>
            <div className="h-1 w-20 bg-accent mx-auto mb-6"></div>
            <p className="text-muted-foreground">Maîtrise des outils et processus essentiels à la conduite de projets BTP.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {[
              { name: "AutoCAD", value: 85 },
              { name: "Revit", value: 75 },
              { name: "Métré & Quantification", value: 90 },
              { name: "Suivi de chantier", value: 85 },
              { name: "Contrôle qualité", value: 80 },
              { name: "Lecture de plans", value: 90 },
            ].map((skill, index) => (
              <motion.div 
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium font-mono text-sm">{skill.name}</span>
                  <span className="text-primary font-mono text-sm">{skill.value}%</span>
                </div>
                <div className="h-2 bg-card rounded-full overflow-hidden border border-border">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-primary"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">Parcours Professionnel</h2>
          <div className="h-1 w-20 bg-primary mx-auto mb-16"></div>

          <div className="max-w-3xl mx-auto space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-background border border-border p-6 rounded-xl flex flex-col md:flex-row gap-6 relative"
            >
              <div className="hidden md:block w-32 shrink-0 pt-1">
                <span className="text-accent font-mono font-bold">2022 - Prs</span>
              </div>
              <div className="flex-1">
                <div className="md:hidden text-accent font-mono font-bold mb-2">2022 - Présent</div>
                <h3 className="text-xl font-bold text-foreground">Métreur</h3>
                <h4 className="text-primary mb-4">YAPGI CONSTRUCTION</h4>
                <p className="text-muted-foreground mb-4">
                  En charge du métré, de la quantification et de l'analyse des coûts des projets de construction. Rédaction des devis quantitatifs et estimatifs (DQE).
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-card text-xs rounded border border-border">Métré</span>
                  <span className="px-2 py-1 bg-card text-xs rounded border border-border">Analyse des coûts</span>
                  <span className="px-2 py-1 bg-card text-xs rounded border border-border">DQE</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-background border border-border p-6 rounded-xl flex flex-col md:flex-row gap-6 relative"
            >
              <div className="hidden md:block w-32 shrink-0 pt-1">
                <span className="text-muted-foreground font-mono font-bold">2020 - 2022</span>
              </div>
              <div className="flex-1">
                <div className="md:hidden text-muted-foreground font-mono font-bold mb-2">2020 - 2022</div>
                <h3 className="text-xl font-bold text-foreground">Technicien Supérieur</h3>
                <h4 className="text-primary mb-4">HOUSE CARE INTERNATIONAL</h4>
                <p className="text-muted-foreground mb-4">
                  Suivi de chantier, contrôle qualité et contrôle des travaux sur plusieurs sites.
                </p>
                <div className="bg-card p-4 rounded-md border border-border mb-4">
                  <strong className="block text-sm mb-2 text-foreground">Réalisations clés :</strong>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside ml-4">
                    <li>Contrôle de fondation pour 3 villas duplex</li>
                    <li>Contrôle qualité d'un immeuble R+3 à Songon</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Projets Complétés", value: stats?.projectsCompleted || 12, icon: Building },
              { label: "Chantiers Supervisés", value: stats?.sitesSupervised || 5, icon: HardHat },
              { label: "Années d'Expérience", value: stats?.yearsExperience || 4, icon: Award },
              { label: "Plans Créés", value: stats?.plansCreated || 45, icon: PenTool },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-background border border-border rounded-xl shadow-lg"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-accent" />
                <div className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Prêt à construire l'avenir ?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Vous cherchez un profil rigoureux pour superviser vos chantiers ou assurer vos métrés ? Discutons de votre prochain projet.
          </p>
          <Button size="lg" asChild className="h-16 px-10 text-xl bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/contact">Me Contacter <ChevronRight className="ml-2 h-6 w-6" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
