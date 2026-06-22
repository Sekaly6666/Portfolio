import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListMedia } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, Video, Play, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

const mediaFilters = ["Tous", "photo", "video", "drone"];
const filterLabels: Record<string, string> = { Tous: "Tous", photo: "Photos", video: "Vidéos", drone: "Drone" };

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { data: media, isLoading } = useListMedia();

  const filtered = media?.filter(m => filter === "Tous" || m.type === filter) || [];
  const lightboxItems = filtered.filter(m => m.type === "photo" || m.type === "drone");

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-border mb-12">
        <div className="absolute inset-0 bg-blueprint opacity-5 pointer-events-none" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-accent font-mono text-sm tracking-widest uppercase mb-3">Galerie</p>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Médiathèque</h1>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full" />
            <p className="text-muted-foreground mt-4 max-w-2xl">
              Galerie photos et vidéos de l'évolution des chantiers, des réalisations terminées et des prises de vue drone.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex gap-2 flex-wrap mt-8"
          >
            {mediaFilters.map(f => (
              <motion.button
                key={f}
                onClick={() => setFilter(f)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 flex items-center gap-2 ${
                  filter === f
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                    : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {f === "photo" && <Camera className="w-3.5 h-3.5" />}
                {f === "video" && <Video className="w-3.5 h-3.5" />}
                {f === "drone" && <Play className="w-3.5 h-3.5" />}
                {filterLabels[f]}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <Skeleton className="aspect-square rounded-xl" />
              </motion.div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-card rounded-2xl border border-border"
          >
            <Camera className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-2">Médiathèque vide</h3>
            <p className="text-muted-foreground">Les photos et vidéos de chantier seront disponibles prochainement.</p>
            <p className="text-sm text-muted-foreground mt-2">Vous pouvez en ajouter depuis le tableau de bord.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
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
                  <div className="w-full h-full bg-background flex items-center justify-center">
                    <div className="absolute inset-0 bg-blueprint opacity-5" />
                    <motion.div
                      className="w-14 h-14 rounded-full bg-accent/90 flex items-center justify-center"
                      whileHover={{ scale: 1.15 }}
                    >
                      <Play className="w-6 h-6 text-white ml-1" fill="white" />
                    </motion.div>
                  </div>
                ) : (
                  <img src={item.url} alt={item.title || ""} className="w-full h-full object-cover" />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  {item.title && (
                    <p className="text-white text-xs font-medium line-clamp-1">{item.title}</p>
                  )}
                </div>
                <div className="absolute top-2 right-2">
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
              className="relative max-w-4xl w-full max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxItems[lightboxIndex]?.url}
                alt=""
                className="w-full h-full object-contain rounded-xl"
              />
              <button
                className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                onClick={() => setLightboxIndex(null)}
                data-testid="button-close-lightbox"
              >
                <X className="w-5 h-5" />
              </button>
              {lightboxIndex > 0 && (
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                  onClick={() => setLightboxIndex(prev => (prev !== null ? prev - 1 : null))}
                  data-testid="button-lightbox-prev"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {lightboxIndex < lightboxItems.length - 1 && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                  onClick={() => setLightboxIndex(prev => (prev !== null ? prev + 1 : null))}
                  data-testid="button-lightbox-next"
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
