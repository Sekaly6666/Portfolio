import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListMedia } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, Video, Play, X, ChevronLeft, ChevronRight, Camera, Lock, Folder, FolderPlus, Upload, Trash2, Edit2, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMediaAdmin } from "@/hooks/useMediaAdmin";

const mediaFilters = ["Tous", "photo", "video"];
const filterLabels: Record<string, string> = { Tous: "Tous", photo: "Photos", video: "Vidéos" };

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function Media() {
  const [filter, setFilter] = useState("Tous");
  const [activeFolderId, setActiveFolderId] = useState<string | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { data: defaultMedia, isLoading } = useListMedia();
  
  // Admin hook
  const admin = useMediaAdmin();

  // Login state
  const [loginId, setLoginId] = useState("");
  const [loginMdp, setLoginMdp] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Upload/Folder state
  const [newFolderName, setNewFolderName] = useState("");
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combine default media from mock API with custom media from local storage
  const allMedia = [
    ...(defaultMedia || []).map(m => ({ ...m, folderId: "default" })),
    ...admin.customMedia
  ];

  // Filtering
  const folderFiltered = activeFolderId === "all" ? allMedia : allMedia.filter(m => m.folderId === activeFolderId);
  const typeFiltered = folderFiltered.filter(m => filter === "Tous" || m.type === filter);
  const lightboxItems = typeFiltered;

  // Visible Folders
  const visibleFolders = filter === "Tous" ? admin.folders : admin.folders.filter(f => f.type === filter);

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
      const folderType = filter === "Tous" ? "tous" : (filter as "photo" | "video");
      admin.addFolder(newFolderName.trim(), folderType);
      setNewFolderName("");
      setIsNewFolderOpen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const folderId = activeFolderId === "all" ? (admin.folders[0]?.id || "default") : activeFolderId;
      const detectedType = file.type.startsWith("video/") ? "video" : "photo";
      admin.addMedia(folderId, detectedType, file);
      setIsUploadOpen(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border mb-8">
        <div className="absolute inset-0 bg-blueprint opacity-5 pointer-events-none" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex justify-between items-start">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="text-accent font-mono text-sm tracking-widest uppercase mb-3">Galerie</p>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Médiathèque</h1>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full" />
              <p className="text-muted-foreground mt-4 max-w-2xl">
                Galerie photos et vidéos organisée par dossiers. Retrouvez l'évolution de nos chantiers.
              </p>
            </motion.div>

            {/* Admin Auth / Controls */}
            <div className="flex flex-col items-end gap-4">
              {!admin.isAdmin ? (
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Lock className="w-4 h-4" /> Propriétaire
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Connexion Propriétaire</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="id">Identifiant</Label>
                        <Input 
                          id="id" 
                          value={loginId} 
                          onChange={(e) => setLoginId(e.target.value)} 
                          placeholder="Identifiant"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mdp">Mot de passe</Label>
                        <Input 
                          id="mdp" 
                          type="password" 
                          value={loginMdp} 
                          onChange={(e) => setLoginMdp(e.target.value)} 
                          placeholder="Mot de passe"
                        />
                      </div>
                      {loginError && <p className="text-destructive text-sm">Identifiants incorrects.</p>}
                      <Button type="submit" className="w-full">Se connecter</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary hidden sm:inline-block">Mode Administrateur</span>
                  <Button variant="ghost" size="icon" onClick={() => admin.logout()} title="Se déconnecter">
                    <LogOut className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex gap-2 flex-wrap mt-8"
          >
            {mediaFilters.map(f => (
              <motion.button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setActiveFolderId("all");
                  setLightboxIndex(null);
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 flex items-center gap-2 ${
                  filter === f
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                    : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {f === "photo" && <Camera className="w-3.5 h-3.5" />}
                {f === "video" && <Play className="w-3.5 h-3.5" />}
                {filterLabels[f]}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
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

          {admin.isAdmin && filter !== "Tous" && (
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
                  <Input 
                    placeholder="Nom du dossier" 
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    autoFocus
                  />
                  <Button type="submit" className="w-full">Créer</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Admin Upload Area */}
        {admin.isAdmin && filter !== "Tous" && (
          <div className="mb-8 p-6 bg-card border border-border rounded-xl border-dashed flex flex-col items-center justify-center gap-4 text-center">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Ajouter des médias</h3>
              
              {visibleFolders.length === 0 ? (
                <p className="text-sm text-destructive font-medium mb-4">
                  Veuillez d'abord créer un dossier (via le bouton "+ Nouveau dossier") avant de pouvoir importer des médias dans cette section.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    {activeFolderId === "all" ? "Sélectionnez d'abord un dossier spécifique ci-dessus pour organiser vos fichiers." : "Ajoutez des photos ou vidéos au dossier actif."}
                  </p>
                  
                  <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                    <DialogTrigger asChild>
                      <Button disabled={activeFolderId === "all"} className="gap-2">
                        <Upload className="w-4 h-4" /> Importer un fichier
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Importer un média</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <input 
                          type="file" 
                          accept="image/*,video/*"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                        />
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

        {/* Media Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <Skeleton className="aspect-square rounded-xl" />
              </motion.div>
            ))}
          </div>
        ) : typeFiltered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-card rounded-2xl border border-border"
          >
            <Camera className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-2">Médiathèque vide</h3>
            <p className="text-muted-foreground">Aucun média trouvé dans cette catégorie.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {typeFiltered.map((item, idx) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                layout
                whileHover={{ scale: 1.03, zIndex: 10 }}
                transition={{ duration: 0.2 }}
                className="relative aspect-square rounded-xl overflow-hidden border border-border bg-card cursor-pointer group"
                onClick={() => {
                  const lightIdx = lightboxItems.findIndex(l => l.id === item.id);
                  if (lightIdx !== -1) setLightboxIndex(lightIdx);
                }}
                data-testid={`media-item-${item.id}`}
              >
                {item.type === "video" ? (
                  <div className="w-full h-full bg-background flex items-center justify-center relative">
                    <video src={item.url} className="w-full h-full object-cover opacity-60" />
                    <motion.div
                      className="absolute w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center z-10"
                      whileHover={{ scale: 1.15 }}
                    >
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </motion.div>
                  </div>
                ) : (
                  <img src={item.url} alt={item.title || ""} className="w-full h-full object-cover" />
                )}
                {/* Admin Delete Overlay */}
                {admin.isAdmin && item.folderId !== "default" && (
                  <div className="absolute top-2 left-2 z-20">
                    <button
                      className="p-2 bg-destructive/90 text-white rounded-md hover:bg-destructive shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        admin.deleteMedia(item.id);
                      }}
                      title="Supprimer la photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-none">
                  {item.title && (
                    <p className="text-white text-xs font-medium line-clamp-1">{item.title}</p>
                  )}
                </div>
                <div className="absolute top-2 right-2 pointer-events-none">
                  <span className={`p-1.5 rounded-full backdrop-blur-sm ${item.type === "video" ? "bg-accent/80" : "bg-black/40"}`}>
                    {item.type === "video" ? <Video className="w-3 h-3 text-white" /> : <Image className="w-3 h-3 text-white" />}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-4xl w-full max-h-[85vh] flex justify-center items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxItems[lightboxIndex]?.type === "video" ? (
                <video
                  src={lightboxItems[lightboxIndex]?.url}
                  className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={lightboxItems[lightboxIndex]?.url}
                  alt=""
                  className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                />
              )}
              <button
                className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                onClick={() => setLightboxIndex(null)}
              >
                <X className="w-5 h-5" />
              </button>
              {lightboxIndex > 0 && (
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                  onClick={() => setLightboxIndex(prev => (prev !== null ? prev - 1 : null))}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {lightboxIndex < lightboxItems.length - 1 && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                  onClick={() => setLightboxIndex(prev => (prev !== null ? prev + 1 : null))}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
