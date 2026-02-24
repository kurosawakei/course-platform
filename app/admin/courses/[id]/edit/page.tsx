import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseForm } from "@/components/course-form";
import { updateCourse } from "@/app/actions/courses";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "講座編集" };

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params;

  const [course, categories] = await Promise.all([
    prisma.course.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!course) notFound();

  const updateCourseWithId = updateCourse.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/admin/courses" className="hover:text-blue-600">講座管理</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">編集</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">講座編集</h1>
      <CourseForm
        categories={categories}
        defaultValues={{
          title: course.title,
          description: course.description,
          youtubeUrl: course.youtubeUrl,
          thumbnail: course.thumbnail,
          categoryId: course.categoryId,
          published: course.published,
        }}
        action={updateCourseWithId}
        submitLabel="変更を保存"
      />
    </div>
  );
}
