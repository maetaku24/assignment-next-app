"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Post } from "@/app/_interfaces/Post";
import { CategoryForm } from "@/app/_componets/CategoryForm";

export default function Page() {
  const [name, setName] = useState("");
  const { id } = useParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      alert("カテゴリーを更新しました。");
    } catch (error) {
      console.log("カテゴリーの更新に失敗しました。", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!confirm("記事を削除しますか？")) return;

      await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      alert("記事を削除しました。");
      router.push("/admin/categories");
    } catch (error) {
      console.log("記事の削除に失敗しました。", error);
    }
  };

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`);
      const { category } = await res.json();
      setName(category.name);
    };

    fetcher();
  }, [id]);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
      </div>

      <CategoryForm
        mode="edit"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  )
}
