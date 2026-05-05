import { prisma } from "@/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signToken } from "../../../../lib/jwt";

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  try {

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const users = await prisma.user.create({
        data: {
        name,
        email,
        password: hashedPassword,
        role
        }
    })
    const token = signToken({name:users.name, email: users.email, role: users.role});
    return NextResponse.json({token}, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}