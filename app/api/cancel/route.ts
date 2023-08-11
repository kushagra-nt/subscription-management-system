import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb';
import axios from "axios";

export const POST = async(req: NextRequest) => {

    try{
        const body = await req.json();

        const {userId} = body;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        await axios.delete(`https://api.stripe.com/v1/subscriptions/${user?.stripeSubscriptionId}`,{
            headers: {
                Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`
            }
        })

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                subscriptionPlan: 'Cancelled',
                stripeSubscriptionId: null,
            }
        });
        return NextResponse.json({status: 200, message: "Subscription Cancelled"});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({status: 500, message: "Internal Server Error"});
    }

}