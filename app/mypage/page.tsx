import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course-card";

export const metadata: Metadata = { title: "マイページ" };

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  type ProgressWithCourse = Prisma.ProgressGetPayload<{
    include: { course: { include: { category: true } } };
  }>;

  const [progresses, totalPublished]: [ProgressWithCourse[], number] = await Promise.all([
    prisma.progress.findMany({
      where: { userId: user.id },
      include: { course: { include: { category: true } } },
      orderBy: { watchedAt: "desc" },
    }),
    prisma.course.count({ where: { published: true } }),
  ]);

  const watchedCount = progresses.length;
  const progressRate = totalPublished > 0 ? Math.round((watchedCount / totalPublished) * 100) : 0;

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#1c1d1f] mb-6">マイページ</h1>

      {/* 進捗サマリー */}
      <div className="border border-[#d1d7dc] bg-white p-6 mb-8">
        <h2 className="text-[14px] font-bold text-[#6a6f73] uppercase tracking-wider mb-4">視聴進捗</h2>
        <div className="flex items-end gap-3 mb-4">
          <span className="text-[48px] font-extrabold text-[#1c1d1f] leading-none">{watchedCount}</span>
          <span className="text-[15px] text-[#6a6f73] pb-2">/ {totalPublished} 講座視聴済み</span>
        </div>
        <div className="w-full bg-[#d1d7dc] h-2">
          <div
            className="bg-[#a435f0] h-2 transition-all duration-500"
            style={{ width: `${progressRate}%` }}
          />
        </div>
        <p className="text-[13px] text-[#6a6f73] mt-2">{progressRate}% 完了</p>
      </div>

      {/* 視聴済み講座一覧 */}
      <h2 className="text-xl font-extrabold text-[#1c1d1f] mb-4 pb-2 border-b-2 border-[#1c1d1f] inline-block">
        視聴済み講座
      </h2>

      {progresses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 mt-4">
          {progresses.map(({ course }) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 mt-4">
          <svg className="mx-auto w-16 h-16 text-[#d1d7dc] mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <p className="text-[#6a6f73] text-[15px] mb-4">まだ視聴済みの講座がありません</p>
          <Link
            href="/"
            className="inline-block bg-[#a435f0] hover:bg-[#8710d8] text-white px-6 py-3 text-[15px] font-extrabold transition-colors"
          >
            講座を探す
          </Link>
        </div>
      )}
    </div>
  );
}
