import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteCourseButton } from "@/components/delete-course-button";

export const metadata: Metadata = { title: "講座管理" };
export const dynamic = "force-dynamic";

type CourseWithCategory = Prisma.CourseGetPayload<{ include: { category: true } }>;

export default async function AdminCoursesPage() {
  const courses: CourseWithCategory[] = await prisma.course.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#1c1d1f]">講座管理</h1>
        <Link
          href="/admin/courses/new"
          className="bg-[#a435f0] hover:bg-[#8710d8] text-white px-5 py-[10px] text-[14px] font-extrabold transition-colors"
        >
          + 新規講座作成
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20 border border-[#d1d7dc] bg-white">
          <p className="text-[#6a6f73] text-[15px] mb-4">講座がまだ登録されていません</p>
          <Link href="/admin/courses/new" className="text-[#a435f0] hover:text-[#8710d8] text-[14px] font-bold underline">
            最初の講座を作成する
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#d1d7dc] overflow-hidden">
          <table className="w-full text-[14px]">
            <thead className="bg-[#f7f9fa] border-b border-[#d1d7dc]">
              <tr>
                <th className="text-left px-4 py-3 font-bold text-[#1c1d1f]">タイトル</th>
                <th className="text-left px-4 py-3 font-bold text-[#1c1d1f] hidden sm:table-cell">カテゴリ</th>
                <th className="text-center px-4 py-3 font-bold text-[#1c1d1f]">ステータス</th>
                <th className="text-right px-4 py-3 font-bold text-[#1c1d1f]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d1d7dc]">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-[#f7f9fa] transition-colors">
                  <td className="px-4 py-3 font-bold text-[#1c1d1f] max-w-xs truncate">
                    <Link href={`/courses/${course.id}`} className="hover:text-[#a435f0] transition-colors" target="_blank">
                      {course.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[#6a6f73] hidden sm:table-cell">
                    {course.category.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[12px] font-bold ${
                        course.published
                          ? "bg-[#acd2cc] text-[#1c1d1f]"
                          : "bg-[#d1d7dc] text-[#6a6f73]"
                      }`}
                    >
                      {course.published ? "公開中" : "非公開"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="text-[#a435f0] hover:text-[#8710d8] font-bold transition-colors"
                      >
                        編集
                      </Link>
                      <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
