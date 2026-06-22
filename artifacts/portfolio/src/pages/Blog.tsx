export default function Blog() {
  return (
    <div className="min-h-screen py-12 px-4 container mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Technique</h1>
        <div className="h-1 w-20 bg-purple-500 mb-8"></div>
        <p className="text-muted-foreground max-w-2xl">
          Articles, analyses et partages d'expérience sur le génie civil, les techniques de construction et le suivi de chantier.
        </p>
      </div>
      <div className="text-center py-24 bg-card rounded-xl border border-border">
        <h3 className="text-xl font-semibold mb-2">Aucun article publié</h3>
        <p className="text-muted-foreground">Les premiers articles techniques arriveront prochainement.</p>
      </div>
    </div>
  );
}
