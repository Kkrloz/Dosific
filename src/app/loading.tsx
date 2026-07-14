export default function HomeLoading() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border/40 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-2xl shimmer" />
          <div className="space-y-3 flex-1">
            <div className="h-9 w-40 shimmer rounded-lg" />
            <div className="h-5 w-72 shimmer rounded" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border/40 bg-card/60 p-4">
            <div className="h-3 w-24 shimmer rounded mb-3" />
            <div className="h-7 w-20 shimmer rounded" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/40 bg-card/50 p-5">
        <div className="h-5 w-32 shimmer rounded mb-4" />
        <div className="h-10 shimmer rounded" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border/40 bg-card/60 p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="size-10 shimmer rounded-lg" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-32 shimmer rounded" />
                <div className="h-3 w-20 shimmer rounded-full" />
              </div>
            </div>
            <div className="h-8 w-28 shimmer rounded mb-3" />
            <div className="space-y-2 pt-3 border-t border-border/20">
              <div className="h-4 w-full shimmer rounded" />
              <div className="h-4 w-3/4 shimmer rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
