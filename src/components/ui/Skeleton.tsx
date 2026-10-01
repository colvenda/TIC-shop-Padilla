export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <Skeleton className="aspect-square w-full mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-2" />
      <Skeleton className="h-3 w-1/4 mb-4" />
      <div className="flex justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 p-4">
      <Skeleton className="h-24 w-24 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <Skeleton className="h-8 w-24" />
    </div>
  );
}
