"use client";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-3xl mx-auto text-center py-16">
      <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 ring-1 ring-red-500/20">
        <span className="text-2xl">!</span>
      </div>
      <h2 className="text-lg font-semibold text-primary mb-1">Erro ao carregar produto</h2>
      <p className="text-sm text-muted-foreground mb-6">
        {error.message || "Ocorreu um erro inesperado. Tente novamente."}
      </p>
      <button
        onClick={reset}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer"
      >
        Tentar novamente
      </button>
    </div>
  );
}
