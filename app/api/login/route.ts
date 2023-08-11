import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import bcrypt from 'bcrypt';

type UserRequestBody = {
    email: string;
    password: string;
}

export const POST = async (req: NextRequest) => {
    const body: UserRequestBody = await req.json();

    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ message: "Please enter all the fields", success: false }, { status: 400 });
    }

    try{
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(!user){
            return NextResponse.json({ message: "User not found", success: false }, { status: 400 });
        }
        else{
            const comparePassword = await bcrypt.compare(password, user.password);

            if (!comparePassword) {
                return NextResponse.json({ success: false, "message": "UserName or Password Invalid" }, { status: 400 });
            }

            return NextResponse.json({ success: true, message: "User Logged in successfully", user: user, }, { status: 201 });
        }
    }
    catch(err){
        console.log(err);
        return NextResponse.json({ message: "Internal server error", success: false }, { status: 500 });
    }
}