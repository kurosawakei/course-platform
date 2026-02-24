"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams, value]
  );

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6a6f73]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="講座を検索..."
        className="w-full border border-[#1c1d1f] bg-white rounded-full pl-12 pr-24 py-3 text-[14px] text-[#1c1d1f] placeholder:text-[#6a6f73] focus:outline-none focus:ring-2 focus:ring-[#a435f0] focus:border-[#a435f0]"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1c1d1f] hover:bg-[#3e4143] text-white rounded-full px-5 py-2 text-[14px] font-bold transition-colors"
      >
        検索
      </button>
    </form>
  );
}
