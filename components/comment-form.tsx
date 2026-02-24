"use client";

import { useRef, useState, useTransition } from "react";
import { createComment } from "@/app/actions/comments";

export function CommentForm({ courseId }: { courseId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createComment(formData);
        formRef.current?.reset();
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mb-6">
      <input type="hidden" name="courseId" value={courseId} />
      {error && (
        <div className="bg-[#fcbca0] border border-[#f5523c] text-[#1c1d1f] px-4 py-3 text-[14px] font-medium mb-3">
          {error}
        </div>
      )}
      <textarea
        name="content"
        rows={3}
        required
        maxLength={1000}
        placeholder="コメントを入力..."
        className="w-full border border-[#1c1d1f] px-4 py-3 text-[14px] text-[#1c1d1f] placeholder:text-[#6a6f73] focus:outline-none focus:ring-1 focus:ring-[#1c1d1f] resize-none"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#1c1d1f] hover:bg-[#3e4143] text-white px-5 py-[10px] text-[14px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "投稿中..." : "コメントを投稿"}
        </button>
      </div>
    </form>
  );
}
