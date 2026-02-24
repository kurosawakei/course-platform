"use client";

import { useTransition } from "react";
import { deleteCourse } from "@/app/actions/courses";

type Props = { courseId: string; courseTitle: string };

export function DeleteCourseButton({ courseId, courseTitle }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`「${courseTitle}」を削除しますか？\nこの操作は取り消せません。`)) return;
    startTransition(async () => {
      await deleteCourse(courseId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-[#6a6f73] hover:text-[#f5523c] text-[14px] font-bold transition-colors disabled:opacity-50"
    >
      {isPending ? "削除中..." : "削除"}
    </button>
  );
}
