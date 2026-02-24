import Link from "next/link";

export default function CourseNotFound() {
  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-20 text-center">
      <h2 className="text-[32px] font-extrabold text-[#1c1d1f] mb-3">講座が見つかりません</h2>
      <p className="text-[15px] text-[#6a6f73] mb-8">お探しの講座は存在しないか、非公開になっています。</p>
      <Link href="/" className="inline-block bg-[#a435f0] hover:bg-[#8710d8] text-white px-6 py-3 text-[15px] font-extrabold transition-colors">
        講座一覧に戻る
      </Link>
    </div>
  );
}
