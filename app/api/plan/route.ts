import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export const GET = async (req: NextRequest) => {
    try{
        const plans = await prisma.plan.findMany({});
        return NextResponse.json({plans: plans},{status:200});
    }
    catch(err){

    }
}