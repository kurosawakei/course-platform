import { NextResponse } from "next/server";
import pg from "pg";

async function testConnection(label: string, connectionString: string) {
  try {
    const pool = new pg.Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    });
    const result = await pool.query("SELECT 1 as ok");
    await pool.end();
    return `${label}: success ${JSON.stringify(result.rows[0])}`;
  } catch (err) {
    return `${label}: error - ${err instanceof Error ? err.message : String(err)}`;
  }
}

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const directUrl = process.env.DIRECT_URL || "";

  function maskUrl(url: string) {
    if (!url) return "(not set)";
    try {
      const parsed = new URL(url);
      return `${parsed.protocol}//${parsed.username}:****@${parsed.host}${parsed.pathname}${parsed.search}`;
    } catch {
      return `(invalid URL)`;
    }
  }

  // テスト1: DATABASE_URL (Pooler)
  const tests: string[] = [];
  if (dbUrl) tests.push(await testConnection("pooler", dbUrl));

  // テスト2: DIRECT_URL
  if (directUrl) tests.push(await testConnection("direct", directUrl));

  // テスト3: DATABASE_URLからdirect URLを構築してテスト
  if (dbUrl && !directUrl) {
    try {
      const parsed = new URL(dbUrl);
      // poolerのusernameからproject refを取得: "postgres.{ref}" → "{ref}"
      const projectRef = parsed.username.split(".")[1] || "";
      if (projectRef) {
        const directConstructed = `postgresql://postgres:${parsed.password}@db.${projectRef}.supabase.co:5432/postgres`;
        tests.push(await testConnection("direct-constructed", directConstructed));
      }
    } catch {
      tests.push("direct-constructed: could not parse DATABASE_URL");
    }
  }

  return NextResponse.json({
    deployedAt: new Date().toISOString(),
    DATABASE_URL: maskUrl(dbUrl),
    DIRECT_URL: maskUrl(directUrl),
    connectionTests: tests,
  });
}
