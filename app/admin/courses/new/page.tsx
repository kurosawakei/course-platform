import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CourseForm } from "@/components/course-form";
import { createCourse } from "@/app/actions/courses";

export const metadata: Metadata = { title: "新規講座作成" };

export default async function NewCoursePage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/admin/courses" className="hover:text-blue-600">講座管理</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">新規作成</span>
      </nav>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">新規講座作成</h1>
      <CourseForm
        categories={categories}
        action={createCourse}
        submitLabel="講座を作成"
      />
    </div>
  );
}
