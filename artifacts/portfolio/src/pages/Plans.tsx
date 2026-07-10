import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useListPlans } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileBox, Ruler, LayoutGrid, Lock, LogOut, Folder, FolderPlus, Upload, Trash2, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePlansAdmin } from "@/hooks/usePlansAdmin";

function loadCustomCategories(): string[] {
  try {
    const stored = localStorage.getItem("customPlanCategories");
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

export default function Plans() {
  const { data: defaultPlans, isLoading } = useListPlans();
  const [activeTab, setActiveTab] = useState("Tous");
  const [activeFolderId, setActiveFolderId] = useState<string | "all">("all");
  
  const admin = usePlansAdmin();

  // Login state
  const [loginId, setLoginId] = useState("");
  const [loginMdp, setLoginMdp] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Dynamic Categories
  const [customCategories, setCustomCategories] = useState<string[]>(loadCustomCategories);
  const allCategories = ["Tous", ...customCategories];
  
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const addCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (trimmed && !customCategories.includes(trimmed) && trimmed.toLowerCase() !== "tous") {
      const updated = [...customCategories, trimmed];
      setCustomCategories(updated);
      localStorage.setItem("customPlanCategories", JSON.stringify(updated));
      setNewCategoryName("");
    }
  };

  const removeCustomCategory = (cat: string) => {
    const updated = customCategories.filter(c => c !== cat);
    setCustomCategories(updated);
    localStorage.setItem("customPlanCategories", JSON.stringify(updated));
    if (activeTab === cat) setActiveTab("Tous");
  };

  const editCustomCategory = (oldCat: string, newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed || trimmed === oldCat || customCategories.includes(trimmed) || trimmed.toLowerCase() === "tous") return;
    
    const updated = customCategories.map(c => c === oldCat ? trimmed : c);
    setCustomCategories(updated);
    localStorage.setItem("customPlanCategories", JSON.stringify(updated));
    if (activeTab === oldCat) setActiveTab(trimmed);

    // Update folders that had this category
    const storedFolders = localStorage.getItem("planFolders");
    if (storedFolders) {
      try {
        const folders = JSON.parse(storedFolders);
        const updatedFolders = folders.map((f: any) => f.category === oldCat ? { ...f, category: trimmed } : f);
        localStorage.setItem("planFolders", JSON.stringify(updatedFolders));
        // Note: admin.folders will update on next refresh, or we can reload the page to make it simple.
        window.location.reload();
      } catch (e) {}
    }
  };

  // Upload/Folder state
  const [newFolderName, setNewFolderName] = useState("");
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset folder when tab changes
  useEffect(() => {
    setActiveFolderId("all");
  }, [activeTab]);

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

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      const folderCategory = activeTab === "Tous" ? "tous" : activeTab;
      admin.addFolder(newFolderName.trim(), folderCategory);
      setNewFolderName("");
      setIsNewFolderOpen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const folderId = activeFolderId === "all" ? (admin.folders[0]?.id || "default") : activeFolderId;
      const category = activeTab === "Tous" ? "Autres" : activeTab;
      admin.addPlan(folderId, category, file);
      setIsUploadOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Combine plans
  const allPlans = [
    ...(defaultPlans || []).map(p => ({ ...p, folderId: "default", isCustom: false })),
    ...admin.customPlans.map(p => ({
      id: p.id,
      folderId: p.folderId,
      category: p.category,
      title: p.title,
      description: "", // No description for custom plans
      pdfUrl: p.url,
      previewImage: "", // No preview image
      surface: "",
      rooms: 0,
      isCustom: true
    }))
  ];

  // Visible Folders
  const visibleFolders = activeTab === "Tous" ? admin.folders : admin.folders.filter(f => f.category === activeTab);

  // Filter plans
  const folderFiltered = activeFolderId === "all" ? allPlans : allPlans.filter(p => p.folderId === activeFolderId);
  const filteredPlans = folderFiltered.filter(p => activeTab === "Tous" || p.category === activeTab);

  return (
    <div className="min-h-screen py-12 px-4 container mx-auto">
      <div className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bibliothèque de Plans</h1>
          <div className="h-1 w-20 bg-accent mb-8"></div>
          <p className="text-muted-foreground max-w-2xl">
            Une collection de plans architecturaux et de génie civil réalisés dans le cadre de mes projets.
          </p>
        </div>

        {/* Admin Auth */}
        <div className="flex flex-col items-end gap-4 mt-2">
          {!admin.isAdmin ? (
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Lock className="w-4 h-4" /> Propriétaire
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Connexion Administrateur</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Input placeholder="Identifiant" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
                    <Input type="password" placeholder="Mot de passe" value={loginMdp} onChange={(e) => setLoginMdp(e.target.value)} />
                  </div>
                  {loginError && <p className="text-destructive text-sm">Identifiants incorrects.</p>}
                  <Button type="submit" className="w-full">Se connecter</Button>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2" onClick={() => setIsCategoriesModalOpen(true)}>
                <Settings className="w-4 h-4" /> Gérer les catégories
              </Button>
              <span className="text-sm font-medium text-primary hidden sm:inline-block">Mode Administrateur</span>
              <Button variant="ghost" size="icon" onClick={() => admin.logout()} title="Se déconnecter">
                <LogOut className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Manage Categories Modal */}
      <Dialog open={isCategoriesModalOpen} onOpenChange={setIsCategoriesModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gérer les catégories de plans</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <form onSubmit={addCustomCategory} className="flex gap-2">
              <Input placeholder="Nouvelle catégorie (ex: Villas)" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
              <Button type="submit">Ajouter</Button>
            </form>
            <div className="space-y-2 mt-4">
              {customCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">Aucune catégorie personnalisée.</p>
              ) : (
                customCategories.map((cat) => (
                  <div key={cat} className="flex items-center gap-2">
                    <Input
                      defaultValue={cat}
                      onBlur={(e) => editCustomCategory(cat, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeCustomCategory(cat)}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="flex gap-2 flex-wrap items-center mb-8"
      >
        {allCategories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => setActiveTab(cat)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
              activeTab === cat
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Folders Navigation */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {visibleFolders.map(folder => (
          <div key={folder.id} className="relative group">
            <Button 
              variant={activeFolderId === folder.id ? "default" : "outline"}
              onClick={() => setActiveFolderId(folder.id)}
              className="rounded-full gap-2 pr-8"
            >
              <Folder className="w-4 h-4" /> {folder.name}
            </Button>
            {admin.isAdmin && (
              <button 
                onClick={() => admin.deleteFolder(folder.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                title="Supprimer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}

        {admin.isAdmin && activeTab !== "Tous" && (
          <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="rounded-full gap-2 text-accent hover:text-accent hover:bg-accent/10 border border-dashed border-accent/50">
                <FolderPlus className="w-4 h-4" /> Nouveau dossier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Créer un dossier</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateFolder} className="space-y-4 pt-4">
                <Input placeholder="Nom du dossier" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} autoFocus />
                <Button type="submit" className="w-full">Créer</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Admin Upload Area */}
      {admin.isAdmin && activeTab !== "Tous" && (
        <div className="mb-8 p-6 bg-card border border-border rounded-xl border-dashed flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-3 bg-primary/10 text-primary rounded-full">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Ajouter des fichiers</h3>
            {visibleFolders.length === 0 ? (
              <p className="text-sm text-destructive font-medium mb-4">
                Veuillez d'abord créer un dossier avant d'importer des fichiers.
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {activeFolderId === "all" ? "Sélectionnez d'abord un dossier spécifique ci-dessus." : "Ajoutez des fichiers au dossier actif."}
                </p>
                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={activeFolderId === "all"} className="gap-2">
                      <Upload className="w-4 h-4" /> Importer un fichier
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Importer un fichier</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <input type="file" accept="*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                      <Button variant="outline" className="w-full h-24 border-dashed" onClick={() => fileInputRef.current?.click()}>
                        Cliquer pour parcourir vos fichiers
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <Card key={i} className="bg-card border-border"><Skeleton className="h-40 w-full" /><CardContent className="p-4 space-y-2"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-xl border border-border">
          <FileBox className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun fichier trouvé</h3>
          <p className="text-muted-foreground">Aucun document n'est disponible dans ce dossier.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              layout
            >
              <Card className="bg-card border-border overflow-hidden group h-full flex flex-col relative">
                <div className="h-48 bg-secondary relative flex items-center justify-center p-4 border-b border-border">
                  {plan.previewImage ? (
                    <img src={plan.previewImage} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="absolute inset-0 bg-blueprint opacity-30"></div>
                  )}
                  {!plan.previewImage && <FileBox className="w-16 h-16 text-primary relative z-10" />}
                  <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur text-foreground border-border">
                    {plan.category}
                  </Badge>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1" title={plan.title}>{plan.title}</h3>
                  {plan.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{plan.description}</p>}
                  
                  {(plan.surface || plan.rooms) ? (
                    <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground mb-6 mt-auto">
                      {plan.surface && <span className="flex items-center gap-1"><Ruler className="w-3 h-3" /> {plan.surface}</span>}
                      {plan.rooms && <span className="flex items-center gap-1"><LayoutGrid className="w-3 h-3" /> {plan.rooms} Pièces</span>}
                    </div>
                  ) : (
                    <div className="mb-6 mt-auto"></div>
                  )}
                  
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
                    <a href={plan.pdfUrl || "#"} download={plan.isCustom ? plan.title : undefined} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" /> Télécharger
                    </a>
                  </Button>
                </CardContent>

                {/* Delete button */}
                {admin.isAdmin && plan.isCustom && (
                  <button
                    className="absolute top-3 right-3 z-20 p-2 bg-destructive/90 text-white rounded-md hover:bg-destructive shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault();
                      admin.deletePlan(plan.id);
                    }}
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
