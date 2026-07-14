import { Card } from "@/components/ui/card";

export default function ProductDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="h-9 w-36 shimmer rounded-full" />

      <Card className="p-6 border border-border/40 bg-card/60 backdrop-blur-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="size-12 shimmer rounded-xl" />
          <div className="space-y-2 flex-1">
            <div className="h-7 w-56 shimmer rounded" />
            <div className="h-4 w-24 shimmer rounded-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl p-3.5 border border-border/20">
              <div className="h-3 w-20 shimmer rounded mb-3" />
              <div className="h-6 w-16 shimmer rounded" />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border border-border/40 bg-card/60 backdrop-blur-sm">
        <div className="h-5 w-40 shimmer rounded mb-2" />
        <div className="h-4 w-56 shimmer rounded mb-6" />
        <div className="h-[250px] shimmer rounded-xl" />
      </Card>
    </div>
  );
}
