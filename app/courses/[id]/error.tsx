"use client";

import Link from "next/link";

export default function CourseError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-20 text-center">
      <h2 className="text-[26px] font-extrabold text-[#1c1d1f] mb-3">エラーが発生しました</h2>
      <p className="text-[15px] text-[#6a6f73] mb-8">講座の読み込み中にエラーが発生しました。</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="bg-[#a435f0] hover:bg-[#8710d8] text-white px-6 py-[10px] text-[14px] font-extrabold transition-colors"
        >
          再試行
        </button>
        <Link href="/" className="border border-[#1c1d1f] text-[#1c1d1f] hover:bg-[#f7f9fa] px-6 py-[10px] text-[14px] font-bold transition-colors">
          講座一覧に戻る
        </Link>
      </div>
    </div>
  );
}
