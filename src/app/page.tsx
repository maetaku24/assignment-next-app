"use client";

import React, { useEffect, useState } from "react";
import classes from "../app/_styles/Home.module.css";
import Link from "next/link";
import { MicroCmsPost } from "./_interfaces/MicroCmsPost";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      const res = await fetch("https://182j0l8mox.microcms.io/api/v1/posts", {
        headers: {
          "X-MICROCMS-API-KEY": process.env
            .NEXT_PUBLIC_MICROCMS_API_KEY as string,
        },
      });
      const { contents } = await res.json();
      setPosts(contents);
      setLoading(false);
    };

    fetcher();
  }, []);

  if (loading) return <div className={classes.postloading}>読み込み中...</div>;

  return (
    <div>
      <ul className={classes.container}>
        {posts.map((post) => {
          return (
            <li key={post.id} className={classes.list}>
              <Link href={`/posts/${post.id}`} className={classes.link}>
                <div className={classes.post}>
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
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <div />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;
