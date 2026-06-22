import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useListProjects } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Calendar, Ruler, DollarSign, Building, X, ArrowRight, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Project = {
  id: number;
  name: string;
  description: string;
  type: string;
  surface: string | null;
  budget: string | null;
  location: string | null;
  date: string | null;
  status: string;
  coverImage: string | null;
  createdAt: string;
};

const statusColor: Record<string, string> = {
  "terminé": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "en_cours": "bg-accent/20 text-accent border-accent/30",
  "planifié": "bg-primary/20 text-primary border-primary/30",
};

const filters = ["Tous", "Villa", "Immeuble", "Commercial", "École", "Hôpital"];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

export default function Projects() {
  const [filter, setFilter] = useState<string>("Tous");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { data: projects, isLoading } = useListProjects();

  const filteredProjects = projects?.filter(p =>
    filter === "Tous" || p.type === filter
  ) || [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Page header */}
      <div className="relative overflow-hidden border-b border-border mb-12">
        <div className="absolute inset-0 bg-blueprint opacity-5 pointer-events-none" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-accent font-mono text-sm tracking-widest uppercase mb-3">Portfolio</p>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Mes Projets</h1>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full" />
          </motion.div>

          {/* Filter buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex gap-2 flex-wrap mt-8 items-center"
          >
            <Filter className="w-4 h-4 text-muted-foreground mr-1" />
            {filters.map((f) => (
              <motion.button
                key={f}
                onClick={() => setFilter(f)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                data-testid={`filter-${f.toLowerCase()}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  filter === f
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                    : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {f}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden border border-border bg-card"
              >
                <Skeleton className="h-52 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-card rounded-2xl border border-border"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <Building className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">Aucun projet trouvé</h3>
            <p className="text-muted-foreground">Il n'y a pas de projets dans cette catégorie.</p>
          </motion.div>
        ) : (
          <LayoutGroup>
            <motion.div
              key={filter}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    variants={cardVariants}
                    exit="exit"
                    data-testid={`card-project-${project.id}`}
                  >
                    <motion.div
                      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(30,64,175,0.15)" }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border border-border bg-card rounded-2xl cursor-pointer group h-full flex flex-col"
                      onClick={() => setSelectedProject(project as Project)}
                    >
                      {/* Image */}
                      <div className="h-52 bg-card relative overflow-hidden">
                        {project.coverImage ? (
                          <motion.img
                            src={project.coverImage}
                            alt={project.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.6 }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-background relative overflow-hidden">
                            <div className="absolute inset-0 bg-blueprint opacity-10" />
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}
                            >
                              <Building className="w-16 h-16 text-primary/30" />
                            </motion.div>
                          </div>
                        )}
                        {/* Hover overlay */}
                        <motion.div
                          className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <span className="text-white font-semibold flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                            Voir les détails <ArrowRight className="w-4 h-4" />
                          </span>
                        </motion.div>

                        <div className="absolute top-3 right-3">
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor[project.status] || "bg-muted text-muted-foreground border-border"}`}
                          >
                            {project.status}
                          </motion.span>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-mono text-muted-foreground border border-border/50">
                            {project.type}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-200">{project.name}</h3>
                        {project.location && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                            <MapPin className="w-3.5 h-3.5 text-accent" />
                            {project.location}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                          {project.description}
                        </p>
                        <div className="flex justify-between items-center pt-4 border-t border-border">
                          {project.surface && (
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                              <Ruler className="w-3.5 h-3.5" />
                              {project.surface}
                            </span>
                          )}
                          {project.date && (
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono ml-auto">
                              <Calendar className="w-3.5 h-3.5" />
                              {project.date}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
            <DialogContent className="max-w-3xl bg-card border-border p-0 overflow-hidden rounded-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "backOut" }}
              >
                {/* Modal image header */}
                <div className="h-56 bg-background relative overflow-hidden">
                  {selectedProject.coverImage ? (
                    <img src={selectedProject.coverImage} alt={selectedProject.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-background">
                      <div className="absolute inset-0 bg-blueprint opacity-10" />
                      <Building className="w-20 h-20 text-primary/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-foreground">{selectedProject.name}</DialogTitle>
                      <DialogDescription className="mt-1">
                        <Badge variant="outline" className={`border text-xs ${statusColor[selectedProject.status] || "border-border"}`}>
                          {selectedProject.status}
                        </Badge>
                        <Badge variant="outline" className="border border-primary/30 text-primary ml-2 text-xs">
                          {selectedProject.type}
                        </Badge>
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-muted-foreground mb-6">{selectedProject.description}</p>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: MapPin, label: "Localisation", value: selectedProject.location },
                      { icon: Calendar, label: "Date", value: selectedProject.date },
                      { icon: Ruler, label: "Surface", value: selectedProject.surface },
                      { icon: DollarSign, label: "Budget", value: selectedProject.budget },
                    ].map(({ icon: Icon, label, value }) => value ? (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-background border border-border p-3 rounded-xl"
                      >
                        <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs font-mono uppercase tracking-wider">
                          <Icon className="w-3.5 h-3.5 text-accent" />
                          {label}
                        </div>
                        <div className="font-semibold text-sm">{value}</div>
                      </motion.div>
                    ) : null)}
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
