import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }

  try {
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ status: "OK", posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// POSTという命名にすることで、POSTリクエストの時にこの関数が呼ばれる
export const POST = async (request: Request, context: any) => {
  const token = request.headers.get("Authorization") ?? "";
  const { error } = await supabase.auth.getUser(token);

  if (error) {
    return NextResponse.json({ status: error.message }, { status: 400 });
  }

  try {
    // リクエストのbodyを取得
    const body = await request.json()

    // bodyの中からtitle, content, categories, thumbnailImageKeyを取り出す
    const { title, content, categories, thumbnailImageKey } = body

    // 投稿をDBに生成
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailImageKey,
      },
    })

    // 記事とカテゴリーの中間テーブルのレコードをDBに生成
    // 本来複数同時生成には、createManyというメソッドがあるが、sqliteではcreateManyが使えないので、for文1つずつ実施
    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        },
      })
    }

    // レスポンスを返す
    return NextResponse.json({
      status: 'OK',
      message: '作成しました',
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
};
