"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Post } from "@/app/_interfaces/Post";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { token } = useSupabaseSession();

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      try {
        const res = await fetch("/api/admin/posts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const { posts } = await res.json();
        setPosts([...posts]);
      } catch (error) {
        console.log("データの取得ができませんでした", error);
      }
    };

    fetcher();
  }, [token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <button className="shadow-md bg-green-500 hover:bg-green-400 text-white rounded px-4 py-2">
          <Link href="/admin/posts/new">新規作成</Link>
        </button>
      </div>

      <div>
        {posts.map((post) => {
          return (
            <Link href={`/admin/posts/${post.id}`} key={post.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className="text-xl font-bold">{post.title}</div>
                <div className="text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
