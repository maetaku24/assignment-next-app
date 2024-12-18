import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/app/_interfaces/Categories";
import { CategoriesSelect } from "./CategoriesSelect";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

interface Props {
  mode: "new" | "edit";
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailImageKey: string;
  setThumbnailImageKey: (thumbnailImageKey: string) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  categories,
  setCategories,
  onSubmit,
  onDelete,
}) => {
  const router = useRouter();
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return;
    }

    // eventから画像を取得
    const file = event.target.files[0]; // 選択された画像を取得

    // private/は必ずつけること
    const filePath = `private/${uuidv4()}`

    // Supabase Storageに画像をアップロード
    const { data, error } = await supabase.storage
      .from("post_thumbnail")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    // アップロードに失敗したらエラーを表示
    if (error) {
      alert(error.message);
      return;
    }

    // data.pathに画像のパスが格納されているので、thumbnailImageKeyに格納
    setThumbnailImageKey(data.path);
  };

  useEffect(() => {
    if (!thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

  return (
    <form onSubmit={onSubmit} className="spece-y-4">
      <div className="mt-4">
        <label
          htmlFor="title"
          className="block text-sm font-bold text-gray-700"
        >
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="content"
          className="block text-sm font-bold text-gray-700"
        >
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="thumbnailImageKey"
          className="block text-sm font-medium text-gray-700"
        >
          サムネイルURL
        </label>
        <input
          type="file"
          id="thumbnailImageKey"
          onChange={handleImageChange}
          accept="image/*"
        />
        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
      </div>
      <div className="mt-4">
        <label
          htmlFor="thumbnailUrl"
          className="block text-sm font-bold text-gray-700"
        >
          カテゴリー
        </label>
        <CategoriesSelect
          selectedCategories={categories}
          setSelectedCategories={setCategories}
        />
      </div>
      <div className="flex justify-between">
        <div className="flex">
          <button
            type="submit"
            className="shadow-md bg-blue-500 hover:bg-blue-400 text-white rounded px-4 py-2 mt-4"
          >
            {mode === "new" ? "作成" : "更新"}
          </button>
          {mode === "edit" && (
            <button
              type="button"
              className="shadow-md bg-red-500 hover:bg-red-400 text-white rounded px-4 py-2 mt-4 ml-2"
              onClick={onDelete}
            >
              削除
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => router.replace("/admin/posts")}
          className="shadow-md bg-black hover:bg-gray-800 text-white rounded px-4 py-2 mt-4"
        >
          記事一覧へ戻る
        </button>
      </div>
    </form>
  );
};
