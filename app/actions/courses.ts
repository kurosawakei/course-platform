"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const youtubeUrlRegex = /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)/;

const courseSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください").max(200),
  description: z.string().min(1, "説明文を入力してください"),
  youtubeUrl: z
    .string()
    .min(1, "YouTube URLを入力してください")
    .refine((v) => youtubeUrlRegex.test(v), "有効なYouTube URLを入力してください"),
  thumbnail: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
  categoryId: z.string().min(1, "カテゴリを選択してください"),
  published: z.boolean(),
});

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error("認証が必要です");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser || dbUser.role !== "ADMIN") throw new Error("管理者権限が必要です");

  return user;
}

export async function createCourse(formData: FormData) {
  await requireAdmin();

  const parsed = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    youtubeUrl: formData.get("youtubeUrl"),
    thumbnail: formData.get("thumbnail") || "",
    categoryId: formData.get("categoryId"),
    published: formData.get("published") === "true",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { thumbnail, ...rest } = parsed.data;

  await prisma.course.create({
    data: {
      ...rest,
      thumbnail: thumbnail || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/courses");
  redirect("/admin/courses");
}

export async function updateCourse(courseId: string, formData: FormData) {
  await requireAdmin();

  const parsed = courseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    youtubeUrl: formData.get("youtubeUrl"),
    thumbnail: formData.get("thumbnail") || "",
    categoryId: formData.get("categoryId"),
    published: formData.get("published") === "true",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { thumbnail, ...rest } = parsed.data;

  await prisma.course.update({
    where: { id: courseId },
    data: {
      ...rest,
      thumbnail: thumbnail || null,
    },
  });

  revalidatePath("/");
  revalidatePath(`/courses/${courseId}`);
  revalidatePath("/admin/courses");
  redirect("/admin/courses");
}

export async function deleteCourse(courseId: string) {
  await requireAdmin();

  // 関連データをカスケード削除
  await prisma.$transaction([
    prisma.progress.deleteMany({ where: { courseId } }),
    prisma.comment.deleteMany({ where: { courseId } }),
    prisma.course.delete({ where: { id: courseId } }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin/courses");
  revalidatePath(`/courses/${courseId}`);
}
