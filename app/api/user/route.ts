import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb';

export const POST = async (req: NextRequest) => {
    return NextResponse.json({message: 'hello world'});
}

export const GET = async (req: NextRequest) => {
    const userEmail = req.nextUrl.searchParams.get("userEmail");

    try{
        if(!userEmail) return NextResponse.json({status: 400, message: "Bad Request"})

        const user = await prisma.user.findUnique({
            where: {
                email: userEmail
            }
        })
        return NextResponse.json({user},{status:200});
    }
    catch(err){
        return NextResponse.json({status: 500, message: "Internal Server Error"});
    }

}