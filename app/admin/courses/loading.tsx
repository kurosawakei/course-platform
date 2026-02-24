export default function AdminCoursesLoading() {
  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-9 w-36 bg-[#e8e9eb]" />
        <div className="h-10 w-36 bg-[#e8e9eb]" />
      </div>
      <div className="bg-white border border-[#d1d7dc] overflow-hidden">
        <div className="h-12 bg-[#f7f9fa] border-b border-[#d1d7dc]" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-[#d1d7dc]">
            <div className="flex-1 h-4 bg-[#e8e9eb]" />
            <div className="w-24 h-4 bg-[#e8e9eb]" />
            <div className="w-16 h-5 bg-[#e8e9eb]" />
            <div className="w-20 h-4 bg-[#e8e9eb]" />
          </div>
        ))}
      </div>
    </div>
  );
}
