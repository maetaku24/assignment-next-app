"use client";

import React, { useEffect, useState } from "react";
import classes from "../app/_styles/Home.module.css";
import Link from "next/link";
import { Post } from "./_interfaces/Post";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/posts");
      const { posts } = await res.json();
      setPosts(posts);
    };

    fetcher();
  }, []);

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
                        {post.postCategories.map((postCategories) => {
                          return (
                            <p
                              key={postCategories.category.id}
                              className={classes.postCategory}
                            >
                              {postCategories.category.name}
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
}
