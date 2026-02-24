import Link from "next/link";
import Image from "next/image";

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  category: { name: string };
};

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`} className="group block">
      <div className="relative aspect-video bg-gray-200 overflow-hidden border border-[#d1d7dc]">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
          />
        ) : (
          <div className="w-full h-full bg-[#2d2f31] flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
            </svg>
          </div>
        )}
      </div>
      <div className="pt-2 pb-4">
        <h3 className="font-bold text-[#1c1d1f] text-[15px] leading-tight line-clamp-2 group-hover:text-[#a435f0] transition-colors">
          {course.title}
        </h3>
        <p className="mt-1 text-xs text-[#6a6f73] line-clamp-1">{course.description}</p>
        <span className="inline-block mt-2 text-xs font-medium text-[#6a6f73] bg-[#f7f9fa] border border-[#d1d7dc] px-2 py-0.5">
          {course.category.name}
        </span>
      </div>
    </Link>
  );
}
