export function LoadingBoard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-3xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="min-h-[480px] animate-pulse rounded-3xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    </div>
  );
}
