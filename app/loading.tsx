export default function Loading() {
  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <div className="h-9 w-48 bg-[#e8e9eb] animate-pulse mb-2" />
      </div>
      <div className="space-y-4 mb-6">
        <div className="h-12 w-full max-w-2xl bg-[#e8e9eb] rounded-full animate-pulse" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-[#e8e9eb] animate-pulse" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-video bg-[#e8e9eb] animate-pulse border border-[#d1d7dc]" />
            <div className="pt-2 space-y-2">
              <div className="h-4 bg-[#e8e9eb] animate-pulse" />
              <div className="h-3 w-3/4 bg-[#e8e9eb] animate-pulse" />
              <div className="h-5 w-16 bg-[#e8e9eb] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
