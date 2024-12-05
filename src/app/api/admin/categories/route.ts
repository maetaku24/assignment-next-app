import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ state: "OK", categories }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ state: error.message }, { status: 400 });
  }
};

// カテゴリー作成のリクエストボディの型
interface CreateCategoryRequestBody {
  name: string;
}

export const POST = async (request: Request, context: any) => {
  try {
    const body = await request.json();
    const { name }: CreateCategoryRequestBody = body;
    const data = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json({
      state: "OK",
      messege: "作成しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ state: error.message }, { status: 400 });
    }
  }
};
