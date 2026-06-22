export default function Media() {
  return (
    <div className="min-h-screen py-12 px-4 container mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Médiathèque</h1>
        <div className="h-1 w-20 bg-emerald-500 mb-8"></div>
        <p className="text-muted-foreground max-w-2xl">
          Galerie photos et vidéos de l'évolution des chantiers et des réalisations terminées.
        </p>
      </div>
      <div className="text-center py-24 bg-card rounded-xl border border-border">
        <h3 className="text-xl font-semibold mb-2">Module en cours de construction</h3>
        <p className="text-muted-foreground">Revenez bientôt pour voir les photos de chantiers.</p>
      </div>
    </div>
  );
}
