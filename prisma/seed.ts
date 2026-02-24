import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
});
const prisma = new PrismaClient({ adapter });

const categories = [
  "プログラミング",
  "Web開発",
  "データサイエンス",
  "デザイン",
  "ビジネス",
  "マーケティング",
  "語学",
  "その他",
];

const sampleCourses = [
  {
    title: "Next.js 15 完全入門 - App Routerで学ぶモダンWeb開発",
    description:
      "Next.js 15のApp Routerを使って、ゼロからモダンなWebアプリケーションを構築する方法を学びます。Server Components、Server Actions、データフェッチング、認証など実践的な内容をカバーします。",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    categoryName: "Web開発",
    published: true,
  },
  {
    title: "TypeScript実践ガイド - 型安全なコードの書き方",
    description:
      "TypeScriptの基本から応用まで、実際のプロジェクトで役立つ型の活用方法を解説します。ジェネリクス、ユーティリティ型、型ガードなど、中級者向けの内容を網羅しています。",
    youtubeUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
    categoryName: "プログラミング",
    published: true,
  },
  {
    title: "React Hooks完全マスター - useStateからカスタムHooksまで",
    description:
      "React Hooksを基礎から完全に理解するための講座です。useState、useEffect、useContext、useMemo、useCallback、useRefなど主要なHooksの使い方と、カスタムHooksの設計パターンを学びます。",
    youtubeUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    categoryName: "Web開発",
    published: true,
  },
  {
    title: "Python入門 - データ分析の第一歩",
    description:
      "Pythonの基本文法から、Pandas・NumPyを使ったデータ分析の基礎まで学べる入門講座です。実際のデータセットを使って、データの読み込み、加工、可視化を体験します。",
    youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
    thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
    categoryName: "データサイエンス",
    published: true,
  },
  {
    title: "Figmaで学ぶUIデザイン入門",
    description:
      "Figmaの基本操作から、実践的なUIデザインのワークフローまで解説します。コンポーネント設計、Auto Layout、プロトタイピングなど、現場で使えるスキルを身につけましょう。",
    youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    thumbnail: "https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg",
    categoryName: "デザイン",
    published: true,
  },
  {
    title: "Git & GitHub実践講座 - チーム開発の基礎",
    description:
      "Gitのバージョン管理の基礎から、GitHubを使ったチーム開発のワークフローまで学べます。ブランチ戦略、プルリクエスト、コンフリクト解決など実務に必須のスキルをカバーします。",
    youtubeUrl: "https://www.youtube.com/watch?v=RgKAFK5djSk",
    thumbnail: "https://img.youtube.com/vi/RgKAFK5djSk/maxresdefault.jpg",
    categoryName: "プログラミング",
    published: true,
  },
  {
    title: "Tailwind CSS実践 - 効率的なスタイリング手法",
    description:
      "Tailwind CSSを使った効率的なUI構築方法を学びます。ユーティリティファーストの考え方、レスポンシブデザイン、カスタム設定、コンポーネントパターンなど実践的な内容です。",
    youtubeUrl: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    thumbnail: "https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg",
    categoryName: "Web開発",
    published: true,
  },
  {
    title: "Webマーケティング基礎 - SEOとコンテンツ戦略",
    description:
      "Webマーケティングの基礎を体系的に学べる講座です。SEO対策、コンテンツマーケティング、SNS活用、アクセス解析の基本を押さえて、効果的なWeb集客を実現しましょう。",
    youtubeUrl: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    thumbnail: "https://img.youtube.com/vi/OPf0YbXqDm0/maxresdefault.jpg",
    categoryName: "マーケティング",
    published: true,
  },
  {
    title: "Docker入門 - コンテナ技術の基礎と実践",
    description:
      "Dockerの基本概念から、Dockerfile作成、Docker Compose、本番運用まで段階的に学べる講座です。開発環境の構築から、マイクロサービスアーキテクチャの基礎まで幅広くカバーします。",
    youtubeUrl: "https://www.youtube.com/watch?v=hY7m5jjJ9mM",
    thumbnail: "https://img.youtube.com/vi/hY7m5jjJ9mM/maxresdefault.jpg",
    categoryName: "プログラミング",
    published: true,
  },
  {
    title: "ビジネス英語 - ミーティング&プレゼンテーション",
    description:
      "グローバルなビジネスシーンで即使えるビジネス英語を学びます。ミーティングでの発言、プレゼンテーション、メールライティングなど、実践的なフレーズと表現を身につけましょう。",
    youtubeUrl: "https://www.youtube.com/watch?v=YQHsXMglC9A",
    thumbnail: "https://img.youtube.com/vi/YQHsXMglC9A/maxresdefault.jpg",
    categoryName: "語学",
    published: true,
  },
  {
    title: "起業のためのビジネスプラン作成講座",
    description:
      "起業を目指す方のためのビジネスプラン作成講座です。市場分析、ビジネスモデルキャンバス、収支計画、資金調達の基礎を学び、投資家にも通用するビジネスプランを作成しましょう。",
    youtubeUrl: "https://www.youtube.com/watch?v=CevxZvSJLk8",
    thumbnail: "https://img.youtube.com/vi/CevxZvSJLk8/maxresdefault.jpg",
    categoryName: "ビジネス",
    published: true,
  },
  {
    title: "Supabase入門 - BaaSで高速バックエンド構築",
    description:
      "Supabaseを使って、認証、データベース、ストレージ、リアルタイム機能を備えたバックエンドを素早く構築する方法を学びます。Firebase代替としても注目のBaaSを徹底解説します。",
    youtubeUrl: "https://www.youtube.com/watch?v=lQ7nkNpiFqo",
    thumbnail: null,
    categoryName: "Web開発",
    published: true,
  },
];

async function main() {
  console.log("シードデータを投入します...\n");

  // カテゴリ登録
  console.log("1. カテゴリを登録中...");
  const categoryMap = new Map<string, string>();
  for (const name of categories) {
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoryMap.set(name, cat.id);
  }
  console.log(`   ${categories.length} 件のカテゴリを登録しました。`);

  // サンプル講座登録
  console.log("2. サンプル講座を登録中...");
  let created = 0;
  for (const course of sampleCourses) {
    const categoryId = categoryMap.get(course.categoryName);
    if (!categoryId) {
      console.warn(`   カテゴリ「${course.categoryName}」が見つかりません。スキップ: ${course.title}`);
      continue;
    }

    const existing = await prisma.course.findFirst({
      where: { title: course.title },
    });

    if (!existing) {
      await prisma.course.create({
        data: {
          title: course.title,
          description: course.description,
          youtubeUrl: course.youtubeUrl,
          thumbnail: course.thumbnail,
          categoryId,
          published: course.published,
        },
      });
      created++;
    }
  }
  console.log(`   ${created} 件のサンプル講座を登録しました。`);

  console.log("\nシード完了!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
