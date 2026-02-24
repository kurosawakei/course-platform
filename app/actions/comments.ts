"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const commentSchema = z.object({
  content: z.string().min(1, "コメントを入力してください").max(1000, "1000文字以内で入力してください"),
  courseId: z.string().min(1),
});

export async function createComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("認証が必要です");

  const parsed = commentSchema.safeParse({
    content: formData.get("content"),
    courseId: formData.get("courseId"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  await prisma.comment.create({
    data: {
      content: parsed.data.content,
      courseId: parsed.data.courseId,
      userId: user.id,
    },
  });

  revalidatePath(`/courses/${parsed.data.courseId}`);
}

export async function deleteComment(commentId: string, courseId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("認証が必要です");

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new Error("コメントが見つかりません");

  // 投稿者本人または管理者のみ削除可
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (comment.userId !== user.id && dbUser?.role !== "ADMIN") {
    throw new Error("削除権限がありません");
  }

  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/courses/${courseId}`);
}
