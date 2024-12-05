import { NextRequest, NextResponse } from "next/server";
import { Category, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// カテゴリー詳細取得
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return NextResponse.json({ state: "OK", category }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ state: error.message }, { status: 400 });
    }
  }
};

// カテゴリー更新
interface UpdateCategoryRequestBody {
  name: string;
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { name }: UpdateCategoryRequestBody = await request.json();

  try {
    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });

    return NextResponse.json({ state: "OK", category }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ state: error.message }, { status: 400 });
    }
  }
};

// カテゴリー削除
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  
  try {
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ state: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ state: error.message }, { status: 400 });
    }
  }
};
