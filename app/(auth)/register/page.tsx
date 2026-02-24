"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-[400px]">
        <h1 className="text-[32px] font-extrabold text-[#1c1d1f] text-center mb-2">
          アカウント作成
        </h1>
        <p className="text-center text-[14px] text-[#6a6f73] mb-8">
          すでにアカウントをお持ちですか？{" "}
          <Link href="/login" className="text-[#a435f0] hover:text-[#8710d8] font-bold underline">
            ログイン
          </Link>
        </p>

        <div className="border border-[#d1d7dc] bg-white p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-[#fcbca0] border border-[#f5523c] text-[#1c1d1f] px-4 py-3 text-[14px] font-medium">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-[14px] font-bold text-[#1c1d1f] mb-1">
                お名前 <span className="text-[#6a6f73] font-normal">(任意)</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#1c1d1f] px-4 py-3 text-[15px] text-[#1c1d1f] placeholder:text-[#6a6f73] focus:outline-none focus:ring-1 focus:ring-[#1c1d1f]"
                placeholder="山田 太郎"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-[14px] font-bold text-[#1c1d1f] mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#1c1d1f] px-4 py-3 text-[15px] text-[#1c1d1f] placeholder:text-[#6a6f73] focus:outline-none focus:ring-1 focus:ring-[#1c1d1f]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[14px] font-bold text-[#1c1d1f] mb-1">
                パスワード <span className="text-[#6a6f73] font-normal">(6文字以上)</span>
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#1c1d1f] px-4 py-3 text-[15px] text-[#1c1d1f] placeholder:text-[#6a6f73] focus:outline-none focus:ring-1 focus:ring-[#1c1d1f]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-[15px] font-extrabold text-white bg-[#a435f0] hover:bg-[#8710d8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "登録中..." : "新規登録"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
