import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListProjects } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Calendar, Ruler, Banknote, Building, ArrowRight, Filter, Lock, LogOut, Plus, Trash2, Edit2, ImagePlus, Paperclip, Download, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectsAdmin, CustomProject } from "@/hooks/useProjectsAdmin";

const statusColor: Record<string, string> = {
  "terminé": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "en_cours": "bg-accent/20 text-accent border-accent/30",
  "planifié": "bg-primary/20 text-primary border-primary/30",
};

const DEFAULT_TYPES: string[] = [];

function loadCustomTypes(): string[] {
  try {
    const stored = localStorage.getItem("customProjectTypes");
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}
const statuses = ["en_cours", "terminé", "planifié"];
const statusLabels: Record<string, string> = { en_cours: "En cours", terminé: "Terminé", planifié: "Planifié" };

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

type AnyProject = {
  id: string | number;
  name: string;
  description: string;
  type: string;
  surface?: string | null;
  budget?: string | null;
  location?: string | null;
  date?: string | null;
  status: string;
  coverImage?: string | null;
  createdAt: string;
  isCustom?: boolean;
};

const EMPTY_FORM = {
  name: "",
  description: "",
  type: "",
  surface: "",
  budget: "",
  location: "",
  date: "",
  status: "en_cours",
};

export default function Projects() {
  const [filter, setFilter] = useState<string>("Tous");
  const [selectedProject, setSelectedProject] = useState<AnyProject | null>(null);
  const { data: defaultProjects, isLoading } = useListProjects();
  const admin = useProjectsAdmin();

  // Dynamic types (default + custom ones added by owner)
  const [customTypes, setCustomTypes] = useState<string[]>(loadCustomTypes);
  const allTypes = [...DEFAULT_TYPES, ...customTypes.filter(t => !DEFAULT_TYPES.includes(t))];
  const allFilters = ["Tous", ...allTypes];

  const addCustomType = (typeName: string) => {
    const trimmed = typeName.trim();
    if (trimmed && !allTypes.includes(trimmed)) {
      const updated = [...customTypes, trimmed];
      setCustomTypes(updated);
      localStorage.setItem("customProjectTypes", JSON.stringify(updated));
    }
  };

  const removeCustomType = (typeToRemove: string) => {
    const updated = customTypes.filter(t => t !== typeToRemove);
    setCustomTypes(updated);
    localStorage.setItem("customProjectTypes", JSON.stringify(updated));
    if (filter === typeToRemove) setFilter("Tous");
  };

  const editCustomType = (oldType: string, newType: string) => {
    const trimmed = newType.trim();
    if (!trimmed || trimmed === oldType || allTypes.includes(trimmed)) return;
    
    // update list
    const updated = customTypes.map(t => t === oldType ? trimmed : t);
    setCustomTypes(updated);
    localStorage.setItem("customProjectTypes", JSON.stringify(updated));
    if (filter === oldType) setFilter(trimmed);
    
    // update affected projects
    admin.customProjects.forEach(p => {
      if (p.type === oldType) {
        admin.updateProject(p.id, { type: trimmed });
      }
    });
  };

  const [isTypesModalOpen, setIsTypesModalOpen] = useState(false);

  // Admin Login
  const [loginId, setLoginId] = useState("");
  const [loginMdp, setLoginMdp] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Add/Edit Project Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<CustomProject | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [newTypeInput, setNewTypeInput] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = admin.login(loginId, loginMdp);
    if (success) {
      setIsLoginOpen(false);
      setLoginError(false);
      setLoginId("");
      setLoginMdp("");
    } else {
      setLoginError(true);
    }
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, "");
    
    if (!digitsOnly) {
      setForm({ ...form, budget: "" });
      return;
    }

    const formattedNumber = new Intl.NumberFormat("fr-FR").format(parseInt(digitsOnly, 10));
    // Users might want to type dots themselves, but Intl.NumberFormat("fr-FR") uses non-breaking spaces.
    // Replace non-breaking spaces with normal spaces for easier editing, or just let it be.
    // The requirement was "100 000 000 FCFA"
    setForm({ ...form, budget: `${formattedNumber} FCFA` });
  };

  const openAddForm = () => {
    setEditingProject(null);
    setForm({ ...EMPTY_FORM });
    setCoverFile(null);
    setCoverPreview(null);
    setAttachmentFile(null);
    setIsFormOpen(true);
  };

  const openEditForm = (project: CustomProject) => {
    setEditingProject(project);
    setForm({
      name: project.name,
      description: project.description,
      type: project.type,
      surface: project.surface || "",
      budget: project.budget || "",
      location: project.location || "",
      date: project.date || "",
      status: project.status,
    });
    setCoverFile(null);
    setCoverPreview(project.coverImage || null);
    setAttachmentFile(null);
    setIsFormOpen(true);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      name: form.name.trim(),
      description: form.description,
      type: form.type.trim(),
      surface: form.surface || null,
      budget: form.budget || null,
      location: form.location || null,
      date: form.date || null,
      status: form.status,
      coverImage: null,
    };

    if (editingProject) {
      await admin.updateProject(editingProject.id, projectData, coverFile || undefined, attachmentFile || undefined);
    } else {
      await admin.addProject(projectData, coverFile || undefined, attachmentFile || undefined);
    }
    // If a new type was entered, add it to the persistent list
    addCustomType(form.type);
    setIsFormOpen(false);
  };

  // Combine all projects
  const allProjects: AnyProject[] = [
    ...(defaultProjects || []).map(p => ({ ...p, id: String(p.id), isCustom: false })),
    ...admin.customProjects
  ];

  const filteredProjects = allProjects.filter(
    p => filter === "Tous" || p.type.trim().toLowerCase() === filter.trim().toLowerCase()
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Page header */}
      <div className="relative overflow-hidden border-b border-border mb-12">
        <div className="absolute inset-0 bg-blueprint opacity-5 pointer-events-none" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-accent font-mono text-sm tracking-widest uppercase mb-3">Portfolio</p>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Mes Projets</h1>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full mb-6" />
              <p className="text-muted-foreground max-w-2xl">
                Découvrez mes réalisations en architecture, génie civil et construction. Chaque projet reflète mon engagement pour la qualité, l'innovation et le respect des délais.
              </p>
            </motion.div>

            {/* Admin Auth */}
            <div className="flex flex-col items-end gap-3 pt-2">
              {!admin.isAdmin ? (
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <Button variant="outline" className="gap-2" onClick={() => setIsLoginOpen(true)}>
                    <Lock className="w-4 h-4" /> Propriétaire
                  </Button>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Connexion Administrateur</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4 pt-4">
                      <Input placeholder="Identifiant" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
                      <Input type="password" placeholder="Mot de passe" value={loginMdp} onChange={(e) => setLoginMdp(e.target.value)} />
                      {loginError && <p className="text-destructive text-sm">Identifiants incorrects.</p>}
                      <Button type="submit" className="w-full">Se connecter</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="flex items-center gap-3">
                  <Button className="gap-2" onClick={openAddForm}>
                    <Plus className="w-4 h-4" /> Nouveau projet
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => setIsTypesModalOpen(true)}>
                    <Settings className="w-4 h-4" /> Gérer les types
                  </Button>
                  <span className="text-sm font-medium text-primary hidden sm:inline-block">Mode Admin</span>
                  <Button variant="ghost" size="icon" onClick={() => admin.logout()} title="Se déconnecter">
                    <LogOut className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Filter buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex gap-2 flex-wrap items-center"
          >
            <Filter className="w-4 h-4 text-muted-foreground mr-1" />
            {allFilters.map((f) => (
              <motion.button
                key={f}
                onClick={() => setFilter(f)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
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
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="rounded-2xl overflow-hidden border border-border bg-card">
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
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-32 bg-card rounded-2xl border border-border">
            <Building className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-2">Aucun projet trouvé</h3>
            <p className="text-muted-foreground">Il n'y a pas de projets dans cette catégorie.</p>
            {admin.isAdmin && (
              <Button className="mt-6 gap-2" onClick={openAddForm}><Plus className="w-4 h-4" /> Ajouter un projet</Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="wait">
                {filteredProjects.map((project, i) => (
                  <motion.div key={project.id} variants={cardVariants} initial="hidden" animate="visible" exit="exit" transition={{ delay: Math.min(i * 0.05, 0.3) }} className="relative group">
                    <motion.div
                      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(30,64,175,0.15)" }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border border-border bg-card rounded-2xl cursor-pointer h-full flex flex-col"
                      onClick={() => setSelectedProject(project)}
                    >
                      {/* Image */}
                      <div className="h-52 bg-card relative overflow-hidden">
                        {project.coverImage ? (
                          <motion.img src={project.coverImage} alt={project.name} className="w-full h-full object-cover" whileHover={{ scale: 1.08 }} transition={{ duration: 0.6 }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-background relative overflow-hidden">
                            <div className="absolute inset-0 bg-blueprint opacity-10" />
                            <Building className="w-16 h-16 text-primary/30" />
                          </div>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white font-semibold flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                            Voir les détails <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor[project.status] || "bg-muted text-muted-foreground border-border"}`}>
                            {statusLabels[project.status] || project.status}
                          </span>
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
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{project.description}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-border">
                          {project.surface && (
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                              <Ruler className="w-3.5 h-3.5" /> {project.surface}
                            </span>
                          )}
                          {project.date && (
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono ml-auto">
                              <Calendar className="w-3.5 h-3.5" /> {project.date}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Admin Actions */}
                    {admin.isAdmin && project.isCustom && (
                      <div className="absolute top-14 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button
                          className="p-2 bg-background/90 border border-border rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-colors shadow-sm"
                          onClick={(e) => { e.stopPropagation(); openEditForm(project as CustomProject); }}
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-2 bg-background/90 border border-border rounded-lg hover:bg-destructive hover:text-white hover:border-destructive transition-colors shadow-sm"
                          onClick={(e) => { e.stopPropagation(); admin.deleteProject(String(project.id)); }}
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
          </div>
        )}
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selectedProject && (
          <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
            <DialogContent className="max-w-3xl bg-card border-border p-0 overflow-hidden rounded-2xl">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3, ease: "backOut" }}>
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
                          {statusLabels[selectedProject.status] || selectedProject.status}
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
                      { icon: Banknote, label: "Budget", value: selectedProject.budget },
                    ].map(({ icon: Icon, label, value }) => value ? (
                      <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-background border border-border p-3 rounded-xl">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1 text-xs font-mono uppercase tracking-wider">
                          <Icon className="w-3.5 h-3.5 text-accent" /> {label}
                        </div>
                        <div className="font-semibold text-sm">{value}</div>
                      </motion.div>
                    ) : null)}
                  </div>
                  {/* Attachment download */}
                  {(selectedProject as any).attachmentUrl && (
                    <a
                      href={(selectedProject as any).attachmentUrl}
                      download={(selectedProject as any).attachmentName || "fichier"}
                      className="mt-4 flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger : {(selectedProject as any).attachmentName || "Fichier joint"}
                    </a>
                  )}
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Add / Edit Project Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Cover Image */}
            <div
              className="w-full h-36 border-2 border-dashed border-border rounded-xl flex items-center justify-center cursor-pointer relative overflow-hidden hover:border-primary/50 transition-colors"
              onClick={() => coverInputRef.current?.click()}
            >
              {coverPreview ? (
                <img src={coverPreview} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImagePlus className="w-8 h-8" />
                  <span className="text-sm">Ajouter une photo de couverture</span>
                </div>
              )}
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label>Nom du projet *</Label>
                <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Résidence les Palmiers" />
              </div>

              <div className="space-y-1">
                <Label>Type *</Label>
                <div className="flex gap-2">
                  <Input
                    required
                    list="project-types-list"
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    placeholder="Villa, Immeuble..."
                  />
                  <datalist id="project-types-list">
                    {allTypes.map(t => <option key={t} value={t} />)}
                  </datalist>
                </div>
                {form.type && !allTypes.includes(form.type) && (
                  <p className="text-xs text-accent mt-1">
                    ✦ Nouveau type — il sera ajouté aux filtres après création.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label>Statut *</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Localisation</Label>
                <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Abidjan, Côte d'Ivoire" />
              </div>

              <div className="space-y-1">
                <Label>Date</Label>
                <Input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="2024" />
              </div>

              <div className="space-y-1">
                <Label>Surface</Label>
                <Input value={form.surface} onChange={e => setForm({ ...form, surface: e.target.value })} placeholder="250 m²" />
              </div>

              <div className="space-y-1">
                <Label>Budget</Label>
                <Input value={form.budget} onChange={handleBudgetChange} placeholder="120 000 000 FCFA" />
              </div>

              <div className="col-span-2 space-y-1">
                <Label>Description *</Label>
                <Textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description du projet..." />
              </div>

              {/* Attachment */}
              <div className="col-span-2 space-y-1">
                <Label>Fichier joint (PDF, DWG, etc.)</Label>
                <div
                  className="w-full border border-dashed border-border rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => attachmentInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground truncate">
                    {attachmentFile ? attachmentFile.name : "Cliquer pour joindre un fichier (tout format accepté)"}
                  </span>
                  <input ref={attachmentInputRef} type="file" className="hidden" onChange={e => e.target.files?.[0] && setAttachmentFile(e.target.files[0])} />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>Annuler</Button>
              <Button type="submit" className="flex-1">{editingProject ? "Enregistrer" : "Créer"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Manage Types Modal */}
      <Dialog open={isTypesModalOpen} onOpenChange={setIsTypesModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gérer les types de projets</DialogTitle>
            <DialogDescription>
              Vous pouvez renommer ou supprimer les catégories ajoutées.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            {customTypes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">Aucun type personnalisé.</p>
            ) : (
              customTypes.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <Input
                    defaultValue={type}
                    onBlur={(e) => editCustomType(type, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => removeCustomType(type)}
                    title="Supprimer ce type"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
