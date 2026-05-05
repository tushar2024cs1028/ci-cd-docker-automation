import { prisma } from "@/db";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password, email } =  await request.json();
  if (!password || !email) {
    return NextResponse.json({
        error: 'Invalid Input'
    }, {
        status: 400
    })
  }
    try {
        const users = await prisma.user.findUnique({where: {email}})
        if (!users) {
            return NextResponse.json({error: "No user found"}, {status: 404})
        }
                
        const token = signToken({name:users.name, email: users.email});
        if (await bcrypt.compare(password, users.password)) {
            return NextResponse.json({token}, { status: 200 });
        } else {
            return NextResponse.json({error: 'Wrong Credential'}, { status: 400 })
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json({error: 'Internal Server Error'},{ status: 500})
    }  
}