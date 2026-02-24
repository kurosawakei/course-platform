import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";

type CommentWithUser = Prisma.CommentGetPayload<{
  include: { user: { select: { id: true; name: true; email: true; role: true } } };
}>;

type Props = {
  courseId: string;
  currentUserId: string | null;
};

export async function CommentSection({ courseId, currentUserId }: Props) {
  const comments: CommentWithUser[] = await prisma.comment.findMany({
    where: { courseId },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });

  const isAdmin =
    currentUserId != null &&
    comments.some((c) => c.user.id === currentUserId && c.user.role === "ADMIN") ||
    (currentUserId != null &&
      (await prisma.user.findUnique({ where: { id: currentUserId } }))?.role === "ADMIN");

  return (
    <section className="border border-[#d1d7dc] bg-white p-6">
      <h2 className="text-[18px] font-extrabold text-[#1c1d1f] mb-6">
        コメント ({comments.length})
      </h2>

      {/* 投稿フォーム */}
      {currentUserId ? (
        <CommentForm courseId={courseId} />
      ) : (
        <div className="mb-6 p-4 bg-[#f7f9fa] border border-[#d1d7dc] text-[14px] text-[#6a6f73]">
          <a href="/login" className="text-[#a435f0] hover:text-[#8710d8] font-bold underline">ログイン</a>するとコメントできます
        </div>
      )}

      {/* コメント一覧 */}
      <CommentList
        comments={comments}
        courseId={courseId}
        currentUserId={currentUserId}
        isCurrentUserAdmin={isAdmin}
      />
    </section>
  );
}
