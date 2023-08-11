import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from 'bcrypt';

type UserRequestBody = {
    email: string;
    password: string;
    userName: string;
}

export const POST = async (req: NextRequest) => {
    const body: UserRequestBody = await req.json();

    const { email, password, userName } = body;

    if (!email || !password || !userName) {
        return NextResponse.json({ message: "Please enter all the fields", success: false }, { status: 400 });
    }

    try{
        const userAlreadyExists = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(userAlreadyExists){
            return NextResponse.json({ message: "User with same email already exists", success: false }, { status: 400 });
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    userName,
                    email,
                    password: hashedPassword,
                    subscriptionPlan: 'Free',
                    subscribedAt: new Date(),
                    subscriptionEndsAt: new Date(),
                }
            });

            return NextResponse.json({message: "User created successfully", success: true, data: user},{status: 200});
        }
    }
    catch(err){
        console.log(err);
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}