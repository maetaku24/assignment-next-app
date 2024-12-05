"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import classes from "../../_styles/Detail.module.css";
import { Post } from "@/app/_interfaces/Post";

export default function Page() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      const res = await fetch(`/api/posts/${id}`);
      const { post } = await res.json();
      setPost(post);
      setLoading(false);
    };

    fetcher();
  }, [id]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!post) {
    return <div>記事が見つかりません</div>;
  }

  return (
    <div className={classes.container}>
      <div className={classes.post}>
        <div className={classes.postImage}>
          <Image src={post.thumbnailUrl} alt="" height={1000} width={1000} />
        </div>
        <div className={classes.postContent}>
          <div className={classes.postInfo}>
            <div className={classes.postDate}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className={classes.postCategories}>
              {post.postCategories.map((postCategory) => {
                return (
                  <div
                    key={postCategory.category.id}
                    className={classes.postCategory}
                  >
                    {postCategory.category.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={classes.postTitle}>{post.title}</div>
          <div
            className={classes.postBody}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
  );
}
