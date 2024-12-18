"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/app/admin/categories/_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function Paga() {
  const [name, setName] = useState("");
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify({ name }),
      });

      const { id } = await res.json();
      router.push(`/admin/categories/${id}`);
      alert("カテゴリーを作成しました。");
    } catch (error) {
      console.log("データを取得できませんでした。", error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー作成</h1>
      </div>
      <CategoryForm
        mode="new"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
