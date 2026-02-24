"use client";

import { useState, useTransition } from "react";

type Category = { id: string; name: string };

type CourseFormValues = {
  title?: string;
  description?: string;
  youtubeUrl?: string;
  thumbnail?: string | null;
  categoryId?: string;
  published?: boolean;
};

type Props = {
  categories: Category[];
  defaultValues?: CourseFormValues;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
};

export function CourseForm({ categories, defaultValues, action, submitLabel }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await action(formData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "エラーが発生しました");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-[#fcbca0] border border-[#f5523c] text-[#1c1d1f] px-4 py-3 text-[14px] font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[14px] font-bold text-[#1c1d1f] mb-1">タイトル *</label>
        <input
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={defaultValues?.title}
          className="w-full border border-[#1c1d1f] px-4 py-3 text-[15px] text-[#1c1d1f] placeholder:text-[#6a6f73] focus:outline-none focus:ring-1 focus:ring-[#1c1d1f]"
          placeholder="例：Next.js入門講座"
        />
      </div>

      <div>
        <label className="block text-[14px] font-bold text-[#1c1d1f] mb-1">説明文 *</label>
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={defaultValues?.description}
          className="w-full border border-[#1c1d1f] px-4 py-3 text-[15px] text-[#1c1d1f] placeholder:text-[#6a6f73] focus:outline-none focus:ring-1 focus:ring-[#1c1d1f] resize-vertical"
          placeholder="講座の説明を入力してください"
        />
      </div>

      <div>
        <label className="block text-[14px] font-bold text-[#1c1d1f] mb-1">YouTube URL *</label>
        <input
          name="youtubeUrl"
          type="url"
          required
          defaultValue={defaultValues?.youtubeUrl}
          className="w-full border border-[#1c1d1f] px-4 py-3 text-[15px] text-[#1c1d1f] placeholder:text-[#6a6f73] focus:outline-none focus:ring-1 focus:ring-[#1c1d1f]"
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p className="mt-1 text-[12px] text-[#6a6f73]">youtube.com/watch?v= または youtu.be/ 形式</p>
      </div>

      <div>
        <label className="block text-[14px] font-bold text-[#1c1d1f] mb-1">
          サムネイル URL <span className="text-[#6a6f73] font-normal">(任意)</span>
        </label>
        <input
          name="thumbnail"
          type="url"
          defaultValue={defaultValues?.thumbnail ?? ""}
          className="w-full border border-[#1c1d1f] px-4 py-3 text-[15px] text-[#1c1d1f] placeholder:text-[#6a6f73] focus:outline-none focus:ring-1 focus:ring-[#1c1d1f]"
          placeholder="https://example.com/thumbnail.jpg"
        />
      </div>

      <div>
        <label className="block text-[14px] font-bold text-[#1c1d1f] mb-1">カテゴリ *</label>
        <select
          name="categoryId"
          required
          defaultValue={defaultValues?.categoryId}
          className="w-full border border-[#1c1d1f] px-4 py-3 text-[15px] text-[#1c1d1f] focus:outline-none focus:ring-1 focus:ring-[#1c1d1f] bg-white"
        >
          <option value="">選択してください</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[14px] font-bold text-[#1c1d1f] mb-2">公開設定</label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="published"
              value="true"
              defaultChecked={defaultValues?.published === true}
              className="accent-[#a435f0]"
            />
            <span className="text-[14px] text-[#1c1d1f]">公開</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="published"
              value="false"
              defaultChecked={defaultValues?.published !== true}
              className="accent-[#a435f0]"
            />
            <span className="text-[14px] text-[#1c1d1f]">非公開</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-[#d1d7dc]">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#a435f0] hover:bg-[#8710d8] text-white px-6 py-[10px] text-[14px] font-extrabold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "保存中..." : submitLabel}
        </button>
        <a
          href="/admin/courses"
          className="border border-[#1c1d1f] text-[#1c1d1f] hover:bg-[#f7f9fa] px-6 py-[10px] text-[14px] font-bold transition-colors"
        >
          キャンセル
        </a>
      </div>
    </form>
  );
}
