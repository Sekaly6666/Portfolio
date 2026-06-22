import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useListPosts, useGetPost, getGetPostQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Calendar, Tag, ArrowRight, X, ChevronLeft } from "lucide-react";

const categoryColors: Record<string, string> = {
  "Métré": "bg-primary/20 text-primary border-primary/30",
  "Contrôle Qualité": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Technique": "bg-accent/20 text-accent border-accent/30",
  "Gestion": "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const categories = ["Tous", "Métré", "Contrôle Qualité", "Technique", "Gestion"];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

function PostDetail({ postId, onBack }: { postId: number; onBack: () => void }) {
  const { data: post, isLoading } = useGetPost(postId, {
    query: { queryKey: getGetPostQueryKey(postId) }
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-8 text-muted-foreground hover:text-foreground -ml-2"
        data-testid="button-back-blog"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Retour aux articles
      </Button>

      <div className="mb-6">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono border mb-4 ${categoryColors[post.category] || "bg-card border-border text-muted-foreground"}`}>
          {post.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      </div>

      <div className="h-px bg-border mb-8" />

      <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
        {post.content.split("\n\n").map((para, i) => {
          if (para.startsWith("## ")) {
            return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-4">{para.replace("## ", "")}</h2>;
          }
          if (para.startsWith("**") && para.endsWith("**")) {
            return <h3 key={i} className="font-bold text-foreground mt-6 mb-2">{para.replace(/\*\*/g, "")}</h3>;
          }
          if (para.startsWith("- ")) {
            return (
              <ul key={i} className="space-y-1 my-4 list-none pl-0">
                {para.split("\n").map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <span className="text-accent mt-1">•</span>
                    <span>{item.replace("- ", "")}</span>
                  </li>
                ))}
              </ul>
            );
          }
          return <p key={i} className="leading-relaxed mb-4 text-muted-foreground">{para}</p>;
        })}
      </div>
    </motion.div>
  );
}

export default function Blog() {
  const [filter, setFilter] = useState("Tous");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const { data: posts, isLoading } = useListPosts({ published: true });

  const filteredPosts = posts?.filter(p => filter === "Tous" || p.category === filter) || [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Page header */}
      <div className="relative overflow-hidden border-b border-border mb-12">
        <div className="absolute inset-0 bg-blueprint opacity-5 pointer-events-none" />
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-accent font-mono text-sm tracking-widest uppercase mb-3">Partage</p>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Blog Technique</h1>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full" />
            <p className="text-muted-foreground mt-4 max-w-2xl">
              Articles, analyses et partages d'expérience sur le génie civil, les techniques de construction et le suivi de chantier.
            </p>
          </motion.div>

          {!selectedPostId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex gap-2 flex-wrap mt-8"
            >
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                    filter === cat
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                      : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          {selectedPostId ? (
            <PostDetail key="detail" postId={selectedPostId} onBack={() => setSelectedPostId(null)} />
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-6 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-32 bg-card rounded-2xl border border-border"
                >
                  <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
                  <p className="text-muted-foreground">Aucun article dans cette catégorie pour le moment.</p>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      variants={cardVariants}
                      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(30,64,175,0.12)" }}
                      transition={{ duration: 0.3 }}
                      className="group bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 transition-colors duration-300"
                      onClick={() => setSelectedPostId(post.id)}
                      data-testid={`card-post-${post.id}`}
                    >
                      {/* Cover placeholder */}
                      <div className="h-40 bg-background relative overflow-hidden">
                        <div className="absolute inset-0 bg-blueprint opacity-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-primary/20" />
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-mono border ${categoryColors[post.category] || "bg-card border-border text-muted-foreground"}`}>
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.createdAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                          </span>
                          <span className="text-xs text-primary font-medium flex items-center gap-1">
                            Lire <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
