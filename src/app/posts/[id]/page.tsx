"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import classes from "../../_styles/Detail.module.css";
import { MicroCmsPost } from "@/app/_interfaces/MicroCmsPost";

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<MicroCmsPost | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      const res = await fetch(
        `https://182j0l8mox.microcms.io/api/v1/posts/${id}`,
        {
          headers: {
            "X-MICROCMS-API-KEY": process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string,
          },
        }
      );
      const data = await res.json();
      setPost(data);
      setLoading(false);
    };

    fetcher();
  }, [id]);

  if (loading) return <div className={classes.postloading}>読み込み中...</div>;
  if (!post)
    return (
      <div className={classes.postError}>記事が見つかりませんでした。</div>
    );

  return (
    <div className={classes.container}>
      <div className={classes.post}>
        <div className={classes.postImage}>
          <Image height={1000} width={1000} src={post.thumbnail.url} alt="" />
        </div>
        <div className={classes.postContent}>
          <div className={classes.postInfo}>
            <div className={classes.postDate}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className={classes.postCategories}>
              {post.categories.map((category, id) => {
                return (
                  <p key={id} className={classes.postCategory}>
                    {category.name}
                  </p>
                );
              })}
            </div>
          </div>
          <p className={classes.postTitle}>{post.title}</p>
          <div
            className={classes.postBody}
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;
