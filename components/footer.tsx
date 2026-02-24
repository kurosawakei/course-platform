import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1c1d1f] mt-auto">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-1">
            <svg className="w-6 h-6 text-[#a435f0]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-base font-extrabold text-white">CourseHub</span>
          </Link>
          <p className="text-sm text-[#6a6f73]">
            &copy; {new Date().getFullYear()} CourseHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
