import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prismadb';

export const GET = async(req: NextRequest) => {
    try{
        const sessionId = req.nextUrl.searchParams.get("session_id");
        const userId = req.nextUrl.searchParams.get("user_id");
        
        if(!sessionId || !userId) return NextResponse.json({status: 400, message: "Bad Request"})
        
        const temp:any = await axios.get(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`,{
            headers: {
                Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`
            }
        })

        const response = await axios.get(`https://api.stripe.com/v1/subscriptions/${temp.data.subscription}`,{
            headers: {
                Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`
            }
        })
        const session = response.data;

        const plan = await prisma.plan.findFirst({
            where: {
                name: session.payment_settings.payment_method_options.card.mandate_options.description
            }
        })

        const endDate = new Date();
        if(session.items.data[0].price.recurring.interval==='month') endDate.setMonth(endDate.getMonth()+1)
        else endDate.setFullYear(endDate.getFullYear()+1)

        const user = await prisma.user.update({
            where: {
                id: userId as string
            },
            data: {
                subscriptionPlan: plan?.name,
                subscribedAt: new Date(),
                subscriptionEndsAt: endDate,
                stripeSubscriptionId: session.id
            }
        })

        await prisma.logs.create({
            data: {
                email: user.id,
                logMessage: `user ${user.userName} subscriber to ${plan?.name}`,
                timestamp: new Date()
            }
        })

        return NextResponse.json(session,{status:200});
    }
    catch(err:any){
        console.log(err);
        return NextResponse.json({status: 500, message: "Internal Server Error"});
    }
}