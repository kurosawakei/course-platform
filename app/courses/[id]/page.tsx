import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { toEmbedUrl } from "@/lib/youtube";
import { CommentSection } from "@/components/comment-section";
import { RecordProgress } from "@/components/record-progress";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) return { title: "講座が見つかりません" };
  return {
    title: course.title,
    description: course.description.slice(0, 150),
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const course = await prisma.course.findUnique({
    where: { id, published: true },
    include: { category: true },
  });

  if (!course) notFound();

  const embedUrl = user ? toEmbedUrl(course.youtubeUrl) : null;

  return (
    <>
      {/* Video Area - Dark background like Udemy */}
      <div className="bg-[#1c1d1f]">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          {embedUrl ? (
            <>
              <div className="relative w-full aspect-video">
                <iframe
                  src={embedUrl}
                  title={course.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <RecordProgress courseId={course.id} />
            </>
          ) : course.thumbnail ? (
            <div className="relative w-full aspect-video">
              <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
              {!user && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white gap-4">
                  <svg className="w-16 h-16 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <p className="text-lg font-bold">ログインすると動画を視聴できます</p>
                  <Link href="/login" className="bg-[#a435f0] hover:bg-[#8710d8] text-white px-6 py-3 text-[15px] font-extrabold transition-colors">
                    ログイン
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-video bg-[#2d2f31] flex flex-col items-center justify-center gap-4">
              <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {!user && (
                <>
                  <p className="text-[#d1d7dc] font-bold">ログインすると動画を視聴できます</p>
                  <Link href="/login" className="bg-[#a435f0] hover:bg-[#8710d8] text-white px-6 py-3 text-[15px] font-extrabold transition-colors">
                    ログイン
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Course Info */}
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] text-[#6a6f73] mb-4">
          <Link href="/" className="hover:text-[#a435f0] transition-colors">講座一覧</Link>
          <span>&gt;</span>
          <span className="text-[#1c1d1f]">{course.category.name}</span>
        </nav>

        {/* Title */}
        <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#1c1d1f] leading-tight mb-4">{course.title}</h1>

        {/* Category badge */}
        <span className="inline-block text-[12px] font-medium text-[#6a6f73] bg-[#f7f9fa] border border-[#d1d7dc] px-3 py-1 mb-6">
          {course.category.name}
        </span>

        {/* Description */}
        <div className="border border-[#d1d7dc] bg-white p-6 mb-8">
          <h2 className="text-[18px] font-extrabold text-[#1c1d1f] mb-4">講座について</h2>
          <p className="text-[15px] text-[#1c1d1f] leading-relaxed whitespace-pre-wrap">{course.description}</p>
        </div>

        {/* Comments */}
        <CommentSection courseId={course.id} currentUserId={user?.id ?? null} />
      </div>
    </>
  );
}
