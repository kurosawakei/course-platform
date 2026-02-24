import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { HeaderNav } from "./header-nav";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#d1d7dc] shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 h-[70px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-1 shrink-0">
          <svg className="w-8 h-8 text-[#a435f0]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-extrabold tracking-tight text-[#1c1d1f]">CourseHub</span>
        </Link>
        <HeaderNav
          isLoggedIn={!!user}
          userName={dbUser?.name ?? user?.email ?? null}
          isAdmin={dbUser?.role === "ADMIN"}
        />
      </div>
    </header>
  );
}
