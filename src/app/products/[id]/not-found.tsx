import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="max-w-3xl mx-auto text-center py-16">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl text-muted-foreground">?</span>
      </div>
      <h2 className="text-lg font-semibold text-primary mb-1">Produto não encontrado</h2>
      <p className="text-sm text-muted-foreground mb-6">
        O produto que você procura não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
      >
        Voltar para o início
      </Link>
    </div>
  );
}
