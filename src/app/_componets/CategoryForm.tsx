import React from "react";
import { useRouter } from "next/navigation";

interface Props {
  mode: "new" | "edit";
  name: string;
  setName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
}

export const CategoryForm: React.FC<Props> = ({
  mode,
  name,
  setName,
  onSubmit,
  onDelete,
}) => {
  const router = useRouter();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="mt-4">
        <label
          htmlFor="title"
          className="block text-sm font-bold text-gray-700"
        >
          カテゴリー名
        </label>
        <input
          type="text"
          id="title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <div className="flex justify-between">
        <div className="flex">
          <button
            type="submit"
            className="shadow-md bg-blue-500 hover:bg-blue-400 text-white rounded px-4 py-2"
          >
            {mode === "new" ? "作成" : "更新"}
          </button>
          {mode === "edit" && (
            <button
              type="button"
              className="shadow-md bg-red-500 hover:bg-red-400 text-white rounded px-4 py-2 ml-2"
              onClick={onDelete}
            >
              削除
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="shadow-md bg-black hover:bg-gray-800 text-white rounded px-4 py-2"
        >
          カテゴリー一覧へ戻る
        </button>
      </div>
    </form>
  );
};
