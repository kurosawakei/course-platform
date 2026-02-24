import { NextResponse } from "next/server";
import pg from "pg";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "(not set)";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "(not set)";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "(not set)";

  function maskUrl(url: string) {
    if (url === "(not set)") return url;
    try {
      const parsed = new URL(url);
      return `${parsed.protocol}//${parsed.username}:****@${parsed.host}${parsed.pathname}${parsed.search}`;
    } catch {
      return `(invalid URL: ${url.slice(0, 30)}...)`;
    }
  }

  // DB接続テスト
  let dbTest = "not tested";
  try {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    const result = await pool.query("SELECT 1 as ok");
    dbTest = `success: ${JSON.stringify(result.rows[0])}`;
    await pool.end();
  } catch (err) {
    dbTest = `error: ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json({
    deployedAt: new Date().toISOString(),
    DATABASE_URL: maskUrl(dbUrl),
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: supabaseKey.length > 10
      ? `${supabaseKey.slice(0, 10)}...（${supabaseKey.length}文字）`
      : supabaseKey,
    dbConnectionTest: dbTest,
  });
}
