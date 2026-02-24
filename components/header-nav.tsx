"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  userName: string | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
};

export function HeaderNav({ userName, isAdmin, isLoggedIn }: Props) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="flex items-center gap-2">
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-1">
        <Link href="/" className="text-[#1c1d1f] hover:text-[#a435f0] px-3 py-2 text-[14px] font-medium transition-colors">
          講座一覧
        </Link>
        {isLoggedIn && (
          <Link href="/mypage" className="text-[#1c1d1f] hover:text-[#a435f0] px-3 py-2 text-[14px] font-medium transition-colors">
            マイページ
          </Link>
        )}
        {isAdmin && (
          <Link href="/admin/courses" className="text-[#1c1d1f] hover:text-[#a435f0] px-3 py-2 text-[14px] font-medium transition-colors">
            管理画面
          </Link>
        )}
      </div>

      {isLoggedIn ? (
        <div className="hidden md:flex items-center gap-3 ml-2 pl-3 border-l border-[#d1d7dc]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1c1d1f] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {(userName ?? "U")[0].toUpperCase()}
            </div>
            <span className="text-[14px] font-medium text-[#1c1d1f] max-w-[120px] truncate">{userName ?? "ユーザー"}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="text-[14px] text-[#6a6f73] hover:text-[#a435f0] px-2 py-1 transition-colors"
          >
            ログアウト
          </button>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-2 ml-2">
          <Link
            href="/login"
            className="text-[14px] font-bold text-[#1c1d1f] border border-[#1c1d1f] hover:bg-[#f7f9fa] px-4 py-[10px] transition-colors"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="text-[14px] font-bold text-white bg-[#a435f0] hover:bg-[#8710d8] px-4 py-[10px] transition-colors"
          >
            新規登録
          </Link>
        </div>
      )}

      {/* Mobile hamburger */}
      <button
        className="md:hidden p-2 text-[#1c1d1f] hover:bg-gray-100 transition-colors"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="メニュー"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-[70px] left-0 right-0 bg-white border-b border-[#d1d7dc] shadow-lg md:hidden z-50">
          <div className="flex flex-col p-4 gap-1">
            <Link href="/" className="text-[#1c1d1f] hover:text-[#a435f0] px-3 py-3 text-[14px] font-medium border-b border-gray-100" onClick={() => setMenuOpen(false)}>
              講座一覧
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/mypage" className="text-[#1c1d1f] hover:text-[#a435f0] px-3 py-3 text-[14px] font-medium border-b border-gray-100" onClick={() => setMenuOpen(false)}>
                  マイページ
                </Link>
                {isAdmin && (
                  <Link href="/admin/courses" className="text-[#1c1d1f] hover:text-[#a435f0] px-3 py-3 text-[14px] font-medium border-b border-gray-100" onClick={() => setMenuOpen(false)}>
                    管理画面
                  </Link>
                )}
                <div className="flex items-center gap-2 px-3 py-3">
                  <div className="w-8 h-8 bg-[#1c1d1f] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(userName ?? "U")[0].toUpperCase()}
                  </div>
                  <span className="text-[14px] font-medium text-[#1c1d1f]">{userName ?? "ユーザー"}</span>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); handleSignOut(); }}
                  className="text-[14px] text-[#a435f0] font-bold px-3 py-3 text-left"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-[#1c1d1f] font-bold px-3 py-3 text-[14px] border-b border-gray-100" onClick={() => setMenuOpen(false)}>
                  ログイン
                </Link>
                <Link href="/register" className="text-center text-white bg-[#a435f0] font-bold px-3 py-3 text-[14px] mt-2" onClick={() => setMenuOpen(false)}>
                  新規登録
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
