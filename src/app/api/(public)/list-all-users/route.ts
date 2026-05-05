import { prisma } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const request = new URL(req.url).searchParams;
  const lastCursor: string | null = request.get("cursor");
  const q = request.get("q")?.trim() || "";
  const sortBy = request.get("sortBy")?.trim() || "id";
  const order = request.get("order") === "desc" ? "desc" : "asc";
  try {
    const allUsers = await prisma.user.findMany({
      take: 2,
      ...(lastCursor &&
        !isNaN(Number(lastCursor)) && {
          cursor: {
            id: Number(lastCursor),
          },
          skip: 1,
        }),
      where: q
        ? {
            OR: [
              {
                name: {
                  contains: q,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: q,
                  mode: "insensitive",
                },
              },
            ],
          }
        : undefined,
      orderBy: {
        [sortBy]: order,
      },
    });
    return NextResponse.json(
      {
        data: allUsers,
        nextCursor: allUsers.length > 0 && allUsers[allUsers.length - 1].id,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something Went Wrong" },
      { status: 500 },
    );
  }
}
