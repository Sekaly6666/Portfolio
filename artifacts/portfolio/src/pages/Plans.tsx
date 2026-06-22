import { useState } from "react";
import { motion } from "framer-motion";
import { useListPlans } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, FileBox, Ruler, LayoutGrid } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Plans() {
  const { data: plans, isLoading } = useListPlans();
  const categories = ["Tous", "Villas", "Duplex", "Immeubles", "Commerciaux", "Autres"];
  const [activeTab, setActiveTab] = useState("Tous");

  const filteredPlans = plans?.filter(p => activeTab === "Tous" || p.category === activeTab) || [];

  return (
    <div className="min-h-screen py-12 px-4 container mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bibliothèque de Plans</h1>
        <div className="h-1 w-20 bg-accent mb-8"></div>
        <p className="text-muted-foreground max-w-2xl">
          Une collection de plans architecturaux et de génie civil réalisés dans le cadre de mes projets. Téléchargeables au format PDF pour consultation.
        </p>
      </div>

      <Tabs defaultValue="Tous" onValueChange={setActiveTab} className="w-full mb-12">
        <TabsList className="bg-card border border-border w-full flex flex-wrap h-auto p-1 gap-1 justify-start">
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <Card key={i} className="bg-card border-border"><Skeleton className="h-40 w-full" /><CardContent className="p-4 space-y-2"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-xl border border-border">
          <FileBox className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aucun plan trouvé</h3>
          <p className="text-muted-foreground">Aucun document n'est disponible dans cette catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-card border-border overflow-hidden group h-full flex flex-col">
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
                  <h3 className="font-bold text-lg mb-2">{plan.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{plan.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground mb-6 mt-auto">
                    {plan.surface && <span className="flex items-center gap-1"><Ruler className="w-3 h-3" /> {plan.surface}</span>}
                    {plan.rooms && <span className="flex items-center gap-1"><LayoutGrid className="w-3 h-3" /> {plan.rooms} Pièces</span>}
                  </div>
                  
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
                    <a href={plan.pdfUrl || "#"} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" /> PDF / DWG
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
