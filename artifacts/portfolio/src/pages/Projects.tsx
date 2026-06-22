import { useState } from "react";
import { motion } from "framer-motion";
import { useListProjects } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Calendar, Ruler, DollarSign, Building } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Projects() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { data: projects, isLoading } = useListProjects();

  const filteredProjects = projects?.filter(p => filter === "all" || p.type === filter) || [];

  return (
    <div className="min-h-screen py-12 px-4 container mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Mes Projets</h1>
        <div className="h-1 w-20 bg-primary mb-8"></div>
        
        <div className="flex gap-2 flex-wrap">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} className={filter === "all" ? "bg-primary" : ""}>Tous</Button>
          <Button variant={filter === "Villa" ? "default" : "outline"} onClick={() => setFilter("Villa")} className={filter === "Villa" ? "bg-primary" : ""}>Villas</Button>
          <Button variant={filter === "Immeuble" ? "default" : "outline"} onClick={() => setFilter("Immeuble")} className={filter === "Immeuble" ? "bg-primary" : ""}>Immeubles</Button>
          <Button variant={filter === "Commercial" ? "default" : "outline"} onClick={() => setFilter("Commercial")} className={filter === "Commercial" ? "bg-primary" : ""}>Bâtiments Commerciaux</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} className="overflow-hidden border-border bg-card">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-xl border border-border">
          <Building className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun projet trouvé</h3>
          <p className="text-muted-foreground">Il n'y a pas de projets dans cette catégorie pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden border-border bg-card cursor-pointer hover:border-primary/50 transition-colors group h-full flex flex-col" onClick={() => setSelectedProject(project)}>
                <div className="h-48 bg-muted relative overflow-hidden">
                  {project.coverImage ? (
                    <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                      <Building className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={project.status === "Terminé" ? "bg-emerald-500" : "bg-accent"}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{project.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" /> {project.location || "Non spécifié"}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {project.description}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-xs font-mono bg-background px-2 py-1 rounded border border-border">{project.type}</span>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary">Détails →</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-3xl bg-card border-border">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProject.name}</DialogTitle>
                <DialogDescription>
                  <Badge variant="outline" className="mt-2 border-primary text-primary">{selectedProject.type}</Badge>
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="rounded-lg overflow-hidden bg-muted aspect-video relative">
                  {selectedProject.coverImage ? (
                    <img src={selectedProject.coverImage} alt={selectedProject.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                      <Building className="w-16 h-16 opacity-20" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-foreground">{selectedProject.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background border border-border p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm"><MapPin className="w-4 h-4" /> Localisation</div>
                      <div className="font-semibold">{selectedProject.location || "N/A"}</div>
                    </div>
                    <div className="bg-background border border-border p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm"><Calendar className="w-4 h-4" /> Date</div>
                      <div className="font-semibold">{selectedProject.date || "N/A"}</div>
                    </div>
                    <div className="bg-background border border-border p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm"><Ruler className="w-4 h-4" /> Surface</div>
                      <div className="font-semibold">{selectedProject.surface || "N/A"}</div>
                    </div>
                    <div className="bg-background border border-border p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1 text-sm"><DollarSign className="w-4 h-4" /> Budget</div>
                      <div className="font-semibold">{selectedProject.budget || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
