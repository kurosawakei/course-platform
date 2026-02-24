import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { CourseCard } from "@/components/course-card";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";

export const metadata: Metadata = {
  title: "講座一覧",
  description: "動画で学べるオンライン講座の一覧。様々なジャンルから学びたい講座を見つけましょう。",
};

export const revalidate = 60;

type SearchParams = Promise<{ q?: string; category?: string }>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const { q, category } = await searchParams;

  const [courses, categories] = await Promise.all([
    prisma.course.findMany({
      where: {
        published: true,
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(category ? { categoryId: category } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      {/* Banner */}
      {!q && !category && (
        <div className="bg-[#1c1d1f] py-10 sm:py-14">
          <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-[32px] font-extrabold text-white leading-tight mb-3">
                学びたいを、ここから。
              </h1>
              <p className="text-[#d1d7dc] text-[15px] sm:text-base mb-6">
                プロが教える動画講座で、プログラミングからデザインまで幅広いスキルを身につけましょう。
              </p>
              <Suspense>
                <SearchBar />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8">
        {/* Search bar (when filtered) */}
        {(q || category) && (
          <div className="mb-6">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6">
          <Suspense>
            <CategoryFilter categories={categories} />
          </Suspense>
        </div>

        {/* Search info */}
        {(q || category) && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[14px] font-bold text-[#1c1d1f]">{courses.length} 件の結果</span>
            {q && (
              <span className="text-[14px] text-[#6a6f73]">
                「{q}」
              </span>
            )}
          </div>
        )}

        {/* Section heading */}
        {!q && !category && (
          <h2 className="text-xl font-extrabold text-[#1c1d1f] mb-4 pb-2 border-b-2 border-[#1c1d1f] inline-block">
            すべての講座
          </h2>
        )}

        {/* Course Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 mt-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="mx-auto w-16 h-16 text-[#d1d7dc] mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <p className="text-[#1c1d1f] text-base font-bold mb-1">
              {q || category ? "条件に合う講座が見つかりませんでした" : "まだ講座が登録されていません"}
            </p>
            {(q || category) && (
              <Link href="/" className="text-[#a435f0] hover:text-[#8710d8] text-[14px] font-bold mt-2 inline-block underline">
                すべての講座を見る
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
