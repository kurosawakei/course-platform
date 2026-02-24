"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type Category = { id: string; name: string };

export function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("category");

  const handleSelect = useCallback(
    (categoryId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (categoryId) {
        params.set("category", categoryId);
      } else {
        params.delete("category");
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleSelect(null)}
        className={`px-4 py-[6px] text-[14px] font-medium transition-colors ${
          !current
            ? "bg-[#1c1d1f] text-white"
            : "bg-white text-[#1c1d1f] border border-[#d1d7dc] hover:bg-[#f7f9fa]"
        }`}
      >
        すべて
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSelect(cat.id)}
          className={`px-4 py-[6px] text-[14px] font-medium transition-colors ${
            current === cat.id
              ? "bg-[#1c1d1f] text-white"
              : "bg-white text-[#1c1d1f] border border-[#d1d7dc] hover:bg-[#f7f9fa]"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
