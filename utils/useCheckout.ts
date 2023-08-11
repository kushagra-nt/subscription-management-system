"use client";

import { Plan } from "@/constants/types";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import toastStyle from "./toastStyle";
import {loadStripe} from '@stripe/stripe-js';

var stripePromise:any = null;
if(stripePromise === null){
    if(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) throw new Error('stripe publishable key not found');
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

const useCheckout = ()=>{


    const [isLoading, setIsLoading] = useState(false);

    const checkout = async (plan: Plan, duration: string) => {
        setIsLoading(true);
        try{

            const stripe = await stripePromise;
            
            const {error} = await stripe.redirectToCheckout({
                mode: 'subscription',
                lineItems: [{
                    price: duration === 'monthly' ? plan.stripeMonthlyId : plan.stripeYearlyId,
                    quantity: 1
                }],
                successUrl: `${window.location.origin}/success/{CHECKOUT_SESSION_ID}`,
                cancelUrl: `${window.location.origin}`,
            });

            if(error){
                throw new Error(error.message);
            }
        }
        catch(err){
            console.log(err);
            toast.error('failed to redirect to checkout page',
            {
                style: toastStyle
            })
        }
        setIsLoading(false);
    }

    return {isLoading, checkout};

}

export default useCheckout;