"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PostForm } from "@/app/_componets/PostForm";
import { Category } from "@/app/_interfaces/Categories";
import { Post } from "@/app/_interfaces/Post";

export default function Page() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const { id } = useParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, thumbnailUrl, categories }),
      });

      alert("記事を更新しました。");
    } catch (error) {
      console.log("記事の更新に失敗しました。", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!confirm("記事を削除しますか？")) return;

      await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      alert("記事を削除しました。");
      router.push("/admin/posts");
    } catch (error) {
      console.log("記事の削除に失敗しました。", error);
    }
  };

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`);
      const { post }: { post: Post } = await res.json();
      setTitle(post.title);
      setContent(post.content);
      setThumbnailUrl(post.thumbnailUrl);
      setCategories(post.postCategories.map((pc) => pc.category));
    };
    fetcher();
  }, [id]);

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事編集</h1>
      </div>

      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}
