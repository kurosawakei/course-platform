import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "(not set)";
  const directUrl = process.env.DIRECT_URL || "(not set)";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "(not set)";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "(not set)";

  // パスワードをマスク
  function maskUrl(url: string) {
    if (url === "(not set)") return url;
    try {
      const parsed = new URL(url);
      return `${parsed.protocol}//${parsed.username}:****@${parsed.host}${parsed.pathname}${parsed.search}`;
    } catch {
      return `(invalid URL: ${url.slice(0, 30)}...)`;
    }
  }

  return NextResponse.json({
    DATABASE_URL: maskUrl(dbUrl),
    DIRECT_URL: maskUrl(directUrl),
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: supabaseKey.length > 10
      ? `${supabaseKey.slice(0, 10)}...（${supabaseKey.length}文字）`
      : supabaseKey,
  });
}
