import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  HardHat, FileText, ArrowRight, ChevronRight, Award,
  Building, PenTool, MapPin, Calendar, Shield, Zap,
  Users, Star, CheckCircle, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetStats } from "@workspace/api-client-react";
const engineerPhoto = "/hero-photo.jpg";

const roles = ["Métreur", "Suivi de Chantier", "Contrôle Qualité", "Technicien Supérieur", "Génie Civil"];

function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <div ref={ref}>{count}</div>;
}

function BlueprintBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E40AF" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#1E40AF" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Rotating dashed circles — CSS animated divs */}
      {[
        { left: "8%", top: "15%", size: 120, duration: 22 },
        { left: "80%", top: "10%", size: 80, duration: 28 },
        { left: "70%", top: "65%", size: 160, duration: 18 },
        { left: "15%", top: "72%", size: 100, duration: 24 },
      ].map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-dashed border-primary/15"
          style={{
            left: c.left,
            top: c.top,
            width: c.size,
            height: c.size,
            transform: "translate(-50%, -50%)",
            animation: `spin ${c.duration}s linear infinite`,
          }}
        />
      ))}

      {/* Moving diagonal stripe overlay */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(30,64,175,0.025) 40px, rgba(30,64,175,0.025) 41px)",
        }}
        animate={{ backgroundPositionX: ["0px", "80px"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
};

const skills = [
  { name: "AutoCAD", value: 85, color: "from-primary to-primary/60" },
  { name: "Revit", value: 75, color: "from-primary to-primary/60" },
  { name: "Métré & Quantification", value: 92, color: "from-accent to-accent/60" },
  { name: "Suivi de Chantier", value: 88, color: "from-accent to-accent/60" },
  { name: "Contrôle Qualité", value: 83, color: "from-primary to-primary/60" },
  { name: "Lecture de Plans", value: 91, color: "from-accent to-accent/60" },
  { name: "Fondation & Structure", value: 80, color: "from-primary to-primary/60" },
  { name: "Gestion de Projet", value: 76, color: "from-accent to-accent/60" },
];

const softSkills = ["Travail en équipe", "Ouverture d'esprit", "Travail sous pression", "Ponctualité", "Leadership", "Communication"];

const experiences = [
  {
    period: "2023 — Présent",
    role: "Métreur",
    company: "YAPGI CONSTRUCTION",
    description: "En charge du métré, de la quantification et de l'analyse des coûts des projets de construction. Rédaction des devis quantitatifs et estimatifs (DQE).",
    tags: ["Métré", "Analyse des coûts", "DQE", "AutoCAD"],
    highlight: true,
    achievements: ["Estimation de plus de 15 projets", "Réduction des coûts de 8%"],
  },

  {
    period: "2022",
    role: "Technicien Supérieur",
    company: "HOUSE CARE INTERNATIONAL",
    description: "Suivi et contrôle des travaux de construction de trois villas duplex.",
    tags: ["Suivi chantier", "Contrôle qualité", "Inspection"],
    highlight: false,
    achievements: ["Fondation 3 villas duplex", "Immeuble R+3 à Songon"],
  },

];

const certifications = [
  { title: "BTS Génie Civil", subtitle: "Option Bâtiment", year: "2020-2022", icon: Award },
  { title: "Attestation", subtitle: "Stratégie Marketing", year: "2023", icon: Star },
];

export default function Home() {
  const [currentRole, setCurrentRole] = useState(0);
  const { data: stats } = useGetStats();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden border-b border-border"
      >
        <BlueprintBackground />

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent z-10" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="container relative z-20 mx-auto px-4 py-24"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT — Text content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary font-mono text-xs tracking-widest uppercase">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Disponible pour nouveaux projets
                </span>
              </motion.div>

              {/* Name */}
              <motion.div variants={itemVariants}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-none">
                  <span className="block text-foreground">IBRAHIM</span>
                  <span className="block">
                    <span className="text-primary">MATCHE</span>{" "}
                    <span className="text-foreground">CISSÉ</span>
                  </span>
                </h1>
              </motion.div>

              {/* Animated role */}
              <motion.div variants={itemVariants} className="h-12 flex items-center">
                <span className="text-xl md:text-2xl text-muted-foreground font-light">
                  Expert en{" "}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentRole}
                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -20, rotateX: 90 }}
                    transition={{ duration: 0.4, ease: "backOut" }}
                    className="ml-2 text-xl md:text-2xl font-bold text-accent"
                    style={{ display: "inline-block" }}
                  >
                    {roles[currentRole]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              {/* Info chips */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                {[
                  { icon: MapPin, text: "Abidjan, Côte d'Ivoire" },
                  { icon: Calendar, text: "4 ans d'expérience" },
                  { icon: HardHat, text: "Permis A,B,C & E" },
                ].map((item) => (
                  <span key={item.text} className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-md text-sm text-muted-foreground font-mono">
                    <item.icon className="w-3.5 h-3.5 text-accent" />
                    {item.text}
                  </span>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  asChild
                  className="group h-14 px-8 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:shadow-xl"
                  data-testid="button-voir-projets"
                >
                  <Link href="/projets">
                    Voir mes projets
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg border-border hover:border-accent hover:text-accent transition-all duration-300"
                  data-testid="button-telecharger-cv"
                >
                  <Link href="/cv">
                    <FileText className="mr-2 h-5 w-5" />
                    Voir mon CV
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* RIGHT — Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: 60 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: [
                    "0 0 40px 0px rgba(30,64,175,0.2)",
                    "0 0 80px 10px rgba(249,115,22,0.15)",
                    "0 0 40px 0px rgba(30,64,175,0.2)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ borderRadius: "1rem" }}
              />

              {/* Corner accent lines */}
              <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-accent rounded-tl-xl" />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-primary rounded-br-xl" />

              {/* Photo container */}
              <div className="relative w-80 h-96 lg:w-96 lg:h-[480px] rounded-2xl overflow-hidden border border-border/50">
                <img
                  src={engineerPhoto}
                  alt="Ibrahim Matche Cissé - Ingénieur Génie Civil"
                  className="w-full h-full object-cover"
                  data-testid="img-profile"
                />
                {/* Gradient overlay on photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                {/* Floating name card on photo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-md border border-border/60 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                      <HardHat className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Cissé Ibrahim Matche</p>
                      <p className="text-xs text-accent font-mono">Technicien Sup. Génie Civil</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-emerald-400 text-xs font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Open
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Floating stats chips */}
              <motion.div
                className="absolute -left-8 top-16 bg-card border border-border rounded-xl p-3 shadow-xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground font-mono">Projets</p>
                    <p className="font-bold text-foreground text-sm">+15</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -right-6 bottom-24 bg-card border border-border rounded-xl p-3 shadow-xl"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs text-muted-foreground font-mono">Qualité</p>
                    <p className="font-bold text-foreground text-sm">100%</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-9 rounded-full border-2 border-muted-foreground/40 flex justify-center pt-1">
            <motion.div
              className="w-1 h-2 bg-accent rounded-full"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* ─── ABOUT ──────────────────────────────────────────────── */}
      <section className="py-28 bg-card/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="grid md:grid-cols-2 gap-16 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={slideLeft} className="space-y-7">
              <div>
                <p className="text-accent font-mono text-sm tracking-widest uppercase mb-3">À Propos</p>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Passionné par<br />
                  <span className="text-primary">l'excellence</span> BTP
                </h2>
                <div className="mt-4 h-1 w-20 bg-gradient-to-r from-accent to-primary rounded-full" />
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Technicien Supérieur en Génie Civil (Option Bâtiment), je combine rigueur technique et vision globale pour mener à bien des projets de construction d'envergure. Basé à Abidjan, j'interviens sur l'ensemble du cycle de vie du bâtiment.
              </p>

              <div className="flex flex-wrap gap-3">
                {[
                  { dot: "bg-accent", text: "Né le 10 Septembre 2000" },
                  { dot: "bg-primary", text: "Abidjan, Côte d'Ivoire" },
                  { dot: "bg-emerald-500", text: "Permis A,B,C & E" },
                ].map((item) => (
                  <motion.span
                    key={item.text}
                    whileHover={{ scale: 1.05, borderColor: "rgba(249,115,22,0.5)" }}
                    className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-mono text-muted-foreground flex items-center gap-2 cursor-default"
                  >
                    <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                    {item.text}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={slideRight}>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: PenTool, color: "text-primary bg-primary/10", title: "Précision", desc: "Des métrés exacts et un contrôle qualité sans faille pour garantir la pérennité de l'ouvrage." },
                  { icon: Building, color: "text-accent bg-accent/10", title: "Fiabilité", desc: "Le respect strict des délais et des normes de sécurité sur chaque chantier supervisé." },
                  { icon: Shield, color: "text-emerald-400 bg-emerald-400/10", title: "Sécurité", desc: "Application rigoureuse des normes de sécurité et de prévention des risques sur site." },
                  { icon: Zap, color: "text-yellow-400 bg-yellow-400/10", title: "Efficacité", desc: "Optimisation des ressources et des délais pour livrer des projets de qualité dans les temps." },
                ].map((card, i) => (
                  <motion.div
                    key={card.title}
                    variants={itemVariants}
                    whileHover={{ x: 6, borderColor: "rgba(30,64,175,0.4)" }}
                    className="flex gap-4 items-start p-4 bg-background border border-border rounded-xl transition-colors duration-300"
                  >
                    <div className={`p-3 rounded-lg ${card.color} h-fit shrink-0`}>
                      <card.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{card.title}</h4>
                      <p className="text-sm text-muted-foreground">{card.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── SKILLS ─────────────────────────────────────────────── */}
      <section className="py-28 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-accent font-mono text-sm tracking-widest uppercase mb-3">Expertise</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Compétences Techniques</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto mb-6 rounded-full" />
            <p className="text-muted-foreground">Maîtrise des outils et processus essentiels à la conduite de projets BTP.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8 max-w-4xl mx-auto mb-16">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
              >
                <div className="flex justify-between mb-2.5">
                  <span className="font-medium font-mono text-sm text-foreground">{skill.name}</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 + 0.8 }}
                    className="text-primary font-mono text-sm font-bold"
                  >
                    {skill.value}%
                  </motion.span>
                </div>
                <div className="h-2.5 bg-card rounded-full overflow-hidden border border-border relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: index * 0.08 + 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className={`h-full bg-gradient-to-r ${skill.color} relative`}
                  >
                    <motion.div
                      className="absolute right-0 top-0 h-full w-4 bg-white/30"
                      animate={{ x: [0, 8, 0] }}
                      transition={{ duration: 1.5, repeat: 3, delay: index * 0.08 + 1.2 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Soft Skills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-center font-semibold text-muted-foreground uppercase tracking-widest text-xs mb-6 font-mono">Soft Skills</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {softSkills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ scale: 1.08, backgroundColor: "rgba(30,64,175,0.15)", borderColor: "rgba(30,64,175,0.5)" }}
                  className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium cursor-default transition-colors duration-200"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── EXPERIENCE ─────────────────────────────────────────── */}
      <section className="py-28 bg-card/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent font-mono text-sm tracking-widest uppercase mb-3">Parcours</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Expériences Professionnelles</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </motion.div>

          <div className="max-w-3xl mx-auto relative">
            {/* Timeline line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
              className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-accent via-primary to-primary/10 hidden md:block"
            />

            <div className="space-y-8">
              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.2, duration: 0.7 }}
                  whileHover={{ borderColor: "rgba(30,64,175,0.4)", x: 4 }}
                  className={`relative pl-0 md:pl-16 bg-background border rounded-2xl p-6 transition-all duration-300 ${
                    exp.highlight ? "border-primary/30 shadow-lg shadow-primary/5" : "border-border"
                  }`}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className={`absolute left-4 top-7 w-5 h-5 rounded-full border-2 hidden md:flex items-center justify-center ${
                      exp.highlight ? "border-accent bg-accent/20" : "border-primary bg-primary/20"
                    }`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.3, type: "spring" }}
                  >
                    <div className={`w-2 h-2 rounded-full ${exp.highlight ? "bg-accent" : "bg-primary"}`} />
                  </motion.div>

                  {exp.highlight && (
                    <div className="absolute top-4 right-4 px-2 py-0.5 bg-accent/20 border border-accent/30 rounded-full text-accent text-xs font-mono">
                      Actuel
                    </div>
                  )}

                  <span className="text-muted-foreground font-mono text-xs tracking-wider uppercase">{exp.period}</span>
                  <h3 className="text-xl font-bold text-foreground mt-1">{exp.role}</h3>
                  <h4 className="text-primary font-semibold mb-4">{exp.company}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{exp.description}</p>

                  {exp.achievements.length > 0 && (
                    <div className="bg-card border border-border rounded-xl p-4 mb-4">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 font-mono">Réalisations clés</p>
                      <ul className="space-y-1">
                        {exp.achievements.map((a) => (
                          <li key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="w-3 h-3 text-accent shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-card text-xs rounded-lg border border-border font-mono text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CERTIFICATIONS ─────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent font-mono text-sm tracking-widest uppercase mb-3">Diplômes</p>
            <h2 className="text-3xl md:text-4xl font-bold">Certifications</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 max-w-2xl mx-auto">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: "backOut" }}
                whileHover={{ scale: 1.04, rotateY: 5 }}
                style={{ perspective: 1000 }}
                className="flex-1 min-w-[240px] bg-gradient-to-br from-card to-background border border-border rounded-2xl p-6 text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <cert.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">{cert.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{cert.subtitle}</p>
                  <span className="inline-block mt-3 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-mono">{cert.year}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ──────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-card/50 to-accent/10" />
        <div className="absolute inset-0 bg-blueprint opacity-5" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent font-mono text-sm tracking-widest uppercase mb-3">Chiffres</p>
            <h2 className="text-4xl md:text-5xl font-bold">En quelques chiffres</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: "Projets Réalisés", value: stats?.projectsCompleted || 12, icon: Building, suffix: "+", color: "text-primary" },
              { label: "Chantiers Supervisés", value: stats?.sitesSupervised || 8, icon: HardHat, suffix: "+", color: "text-accent" },
              { label: "Années d'Expérience", value: stats?.yearsExperience || 4, icon: Award, suffix: "", color: "text-primary" },
              { label: "Plans Réalisés", value: stats?.plansCreated || 45, icon: PenTool, suffix: "+", color: "text-accent" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: "backOut" }}
                whileHover={{ scale: 1.05, borderColor: "rgba(30,64,175,0.4)" }}
                className="p-6 bg-background border border-border rounded-2xl shadow-lg text-center group transition-all duration-300"
              >
                <motion.div
                  className="w-12 h-12 mx-auto mb-4 bg-card border border-border rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </motion.div>
                <div className={`text-4xl md:text-5xl font-extrabold ${stat.color} mb-1 flex justify-center`}>
                  <AnimatedCounter target={stat.value} />
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 pointer-events-none" />
        <BlueprintBackground />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-accent font-mono text-sm tracking-widest uppercase mb-6">Collaboration</p>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Prêt à construire<br />
              <span className="text-primary">l'avenir</span> ensemble ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Vous cherchez un profil rigoureux pour superviser vos chantiers ou assurer vos métrés ? Discutons de votre prochain projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="group h-16 px-10 text-xl bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:shadow-xl transition-all duration-300"
                data-testid="button-contact-cta"
              >
                <Link href="/contact">
                  Me Contacter
                  <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-16 px-10 text-xl border-border hover:border-primary hover:text-primary transition-all duration-300"
                data-testid="button-projets-cta"
              >
                <Link href="/projets">
                  Voir mes projets
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
