export default function LogoCardSkeleton() {
  return (
    <div className="rounded-2xl bg-[#111] border border-white/5 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-[240px] bg-[#1a1a1a]" />

      {/* Bottom bar skeleton */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <div className="h-3 bg-[#1a1a1a] rounded-full w-3/4" />
        <div className="h-2.5 bg-[#1a1a1a] rounded-full w-1/2" />
      </div>
    </div>
  );
}

// Grid of skeletons
export function LogoGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <LogoCardSkeleton key={i} />
      ))}
    </div>
  );
}