"use client";

import { useTransition } from "react";
import { deleteComment } from "@/app/actions/comments";

type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  user: { id: string; name: string | null; email: string; role: string };
};

type Props = {
  comments: Comment[];
  courseId: string;
  currentUserId: string | null;
  isCurrentUserAdmin: boolean;
};

export function CommentList({ comments, courseId, currentUserId, isCurrentUserAdmin }: Props) {
  if (comments.length === 0) {
    return (
      <p className="text-[14px] text-[#6a6f73] text-center py-10">
        まだコメントがありません。最初のコメントを投稿しましょう。
      </p>
    );
  }

  return (
    <ul className="divide-y divide-[#d1d7dc]">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          courseId={courseId}
          currentUserId={currentUserId}
          isCurrentUserAdmin={isCurrentUserAdmin}
        />
      ))}
    </ul>
  );
}

function CommentItem({
  comment,
  courseId,
  currentUserId,
  isCurrentUserAdmin,
}: {
  comment: Comment;
  courseId: string;
  currentUserId: string | null;
  isCurrentUserAdmin: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const canDelete = currentUserId === comment.user.id || isCurrentUserAdmin;

  function handleDelete() {
    if (!confirm("このコメントを削除しますか？")) return;
    startTransition(async () => {
      await deleteComment(comment.id, courseId);
    });
  }

  return (
    <li className="flex gap-3 py-4">
      <div className="flex-shrink-0 w-10 h-10 bg-[#1c1d1f] rounded-full flex items-center justify-center text-white font-bold text-[14px]">
        {(comment.user.name ?? comment.user.email)[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[14px] font-bold text-[#1c1d1f]">
            {comment.user.name ?? comment.user.email.split("@")[0]}
          </span>
          {comment.user.role === "ADMIN" && (
            <span className="text-[11px] bg-[#f7f9fa] text-[#6a6f73] border border-[#d1d7dc] px-1.5 py-0.5 font-bold uppercase">管理者</span>
          )}
          <span className="text-[12px] text-[#6a6f73]">
            {new Date(comment.createdAt).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <p className="text-[14px] text-[#1c1d1f] whitespace-pre-wrap break-words leading-relaxed">{comment.content}</p>
      </div>
      {canDelete && (
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex-shrink-0 text-[#6a6f73] hover:text-[#f5523c] text-[13px] font-bold mt-1 transition-colors disabled:opacity-50"
          aria-label="削除"
        >
          {isPending ? "..." : "削除"}
        </button>
      )}
    </li>
  );
}
