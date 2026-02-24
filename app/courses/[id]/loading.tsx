export default function CourseDetailLoading() {
  return (
    <>
      <div className="bg-[#1c1d1f]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <div className="aspect-video bg-[#2d2f31] animate-pulse" />
        </div>
      </div>
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 animate-pulse">
        <div className="h-3 w-32 bg-[#e8e9eb] mb-4" />
        <div className="h-9 w-3/4 bg-[#e8e9eb] mb-4" />
        <div className="h-5 w-20 bg-[#e8e9eb] mb-6" />
        <div className="border border-[#d1d7dc] bg-white p-6 space-y-3">
          <div className="h-5 w-32 bg-[#e8e9eb]" />
          <div className="h-4 bg-[#e8e9eb]" />
          <div className="h-4 bg-[#e8e9eb]" />
          <div className="h-4 w-3/4 bg-[#e8e9eb]" />
        </div>
      </div>
    </>
  );
}
