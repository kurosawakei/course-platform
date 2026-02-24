# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 要件定義・データモデル・画面一覧は `../docs/requirements.md` を参照。

## コマンド

`course-platform/` で実行：

```bash
npm run dev     # 開発サーバー起動 http://localhost:3000
npm run build   # プロダクションビルド
npm run lint    # ESLint（v9、eslint.config.mjs）
npm run start   # プロダクションサーバー起動（ビルド後）
```

## 現在の状態

Next.js 16 の初期スキャフォールド。以下のライブラリは**未インストール**：
- Prisma + PostgreSQL（Supabase）
- `@supabase/supabase-js` + `@supabase/ssr`（Supabase Auth）
- Zod

## 主要な依存関係

- **Next.js 16**（App Router）
- **React 19**
- **Tailwind CSS v4** — `postcss.config.mjs` で `@tailwindcss/postcss` を使用。`tailwind.config.js` は**不要**（v4は `app/globals.css` の `@theme` ブロックで設定）
- **TypeScript 5** / **ESLint 9**（フラットコンフィグ）

## アーキテクチャ規約

### Tailwind CSS v4
テーマのカスタマイズは `app/globals.css` の `@theme` ブロックで行う。`tailwind.config.js` は作成しないこと。

### App Router 規約
- デフォルトは Server Components。`"use client"` はイベントハンドラ・hooks・ブラウザAPI使用時のみ
- ルートグループは `(groupName)/` でレイアウト分離
- APIルートは `app/api/[route]/route.ts`
- ミドルウェアはプロジェクトルートの `middleware.ts`（認証ガード・ロールチェック）

### ディレクトリ構成（目標）

```
app/
  (auth)/login/         # ログインページ
  (auth)/register/      # 新規登録ページ
  admin/courses/        # 管理画面（ADMINロールのみ）
  api/                  # APIルート（auth callback, courses, comments, progress）
  courses/[id]/         # 講座詳細・動画プレイヤー
  mypage/               # 視聴済み講座一覧
lib/
  prisma.ts             # Prismaクライアント（シングルトン）
  supabase/
    client.ts           # Client Component 用 Supabase クライアント
    server.ts           # Server Component / Server Action 用
    middleware.ts        # ミドルウェア用（トークンリフレッシュ）
prisma/
  schema.prisma         # DBスキーマ
  seed.ts               # カテゴリのシードデータ
```

### セキュリティルール
- YouTube埋め込みURLは**サーバーサイドで解決**。Client Componentに直接渡さない
- 管理者ルートはミドルウェアでロールチェック。未認証は `/login` へリダイレクト

## Next.js 実装規約

### ファイル配置ルール
各ルートセグメントで以下の特殊ファイルを適切に配置する：
- `page.tsx` — ページ本体（Server Component）
- `layout.tsx` — 共有レイアウト（Server Component）
- `loading.tsx` — Suspense フォールバック UI
- `error.tsx` — エラー境界（`"use client"` 必須）
- `not-found.tsx` — 404 UI

### Server Component / Client Component の使い分け

**Server Component（デフォルト）で行うこと：**
- Prisma を使ったデータ取得
- Supabase Auth でのユーザー認証チェック（`supabase.auth.getUser()`）
- YouTube URL の解決・埋め込み URL 生成
- メタデータの生成

**Client Component（`"use client"`）にするもの：**
- フォーム（検索バー、コメント投稿、講座作成/編集フォーム）
- インタラクティブ UI（モーダル、ドロップダウン、トグル）
- `useState` / `useEffect` / `useRouter`（next/navigation）を使う箇所

### データ取得パターン
```tsx
// ✅ 良い例：Server Component で直接 Prisma を呼ぶ
async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  return <CourseDetail course={course} />;
}

// ❌ 悪い例：Client Component から API を呼ぶ（不要なラウンドトリップ）
"use client"
function CoursePage({ id }: { id: string }) {
  const [course, setCourse] = useState(null);
  useEffect(() => { fetch(`/api/courses/${id}`).then(...) }, []);
}
```

### Server Actions パターン
```tsx
// ✅ 良い例：認証 → バリデーション → 実行 → キャッシュ更新
"use server"
async function createComment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("認証が必要です");

  const parsed = commentSchema.safeParse({
    content: formData.get("content"),
    courseId: formData.get("courseId"),
  });
  if (!parsed.success) throw new Error("入力が不正です");

  await prisma.comment.create({ data: { ...parsed.data, userId: user.id } });
  revalidatePath(`/courses/${parsed.data.courseId}`);
}
```

### キャッシュ戦略（このプロジェクト向け）
| ページ | 戦略 | 理由 |
|--------|------|------|
| 講座一覧 `/` | ISR（`revalidate: 60`） | 更新頻度が低い、全ユーザー共通 |
| 講座詳細 `/courses/[id]` | ISR + タグベース再検証 | コメント投稿時にタグで更新 |
| マイページ `/mypage` | 動的（`no-store`） | ユーザー固有データ |
| 管理画面 `/admin/*` | 動的（`no-store`） | 常に最新データが必要 |

## Supabase Auth 実装規約

### クライアント作成パターン
```tsx
// lib/supabase/client.ts — Client Component 用
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
```

### 認証チェック
- **Server Component / Server Action** では `supabase.auth.getUser()` を使用する
- `supabase.auth.getSession()` はサーバー側では**信頼しない**（JWT 署名の検証が保証されないため）
- 認証が必要な Server Action は必ず先頭で `getUser()` を呼ぶ

### ミドルウェア
- `middleware.ts` で Supabase セッションのリフレッシュを実行
- マッチャーで静的ファイル（`_next/static`, `_next/image`, `favicon.ico`）を除外
- 保護ルート（`/mypage`, `/admin/*`）への未認証アクセスは `/login` にリダイレクト

### 認証フロー
- **メール/パスワード登録** → `supabase.auth.signUp()`
- **Google OAuth** → `supabase.auth.signInWithOAuth({ provider: "google" })`
- **ログアウト** → `supabase.auth.signOut()`
- OAuth コールバックは `app/api/auth/callback/route.ts` で処理

### ロール管理
- ユーザーロール（`USER` / `ADMIN`）は Prisma の User モデルで管理
- Supabase Auth の `user.id` と Prisma の `User.id` を紐付ける

### メタデータ
```tsx
// 静的ページ
export const metadata: Metadata = {
  title: "講座一覧",
  description: "動画講座プラットフォーム",
};

// 動的ページ
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  return { title: course?.title, description: course?.description };
}
```
