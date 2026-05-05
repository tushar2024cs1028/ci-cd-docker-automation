import { requireAuth } from "@/lib/auth";
import { error } from "console";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    const user = requireAuth(req);
    if (user) {
        return NextResponse.json({user},{status: 200})
    } else {
        return NextResponse.json({error: 'Not authorized'}, { status: 401})
    }
}