"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import {toast} from 'react-hot-toast';
import toastStyle from "@/utils/toastStyle";
import { Plan } from "@/constants/types";

type PlansContextData = {
    plans: Plan[] | null,
    cancelSubscription: (userId:string) => void,
    isCancelling: boolean
}

type PlansProviderProps = {
    children: ReactNode;
};

const PlansContext = createContext<PlansContextData | undefined>(undefined);

export const PlansProvider = ({ children }: PlansProviderProps) => {
    const [plans, setPlans] = useState<Plan[] | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(()=>{
        const fetchPlans = async () => {
            const response = await axios.get('/api/plan');
            setPlans(response.data.plans);
        }

        fetchPlans();
    },[]);

    const cancelSubscription = async (userId:string) => {
        setIsCancelling(true);
        try{
            await axios.post('/api/cancel', {userId});
        }
        catch(err){
            toast.error('failed to cancel subscription', {
                style: toastStyle,
            });
        }
        setIsCancelling(false);
    }

    return (
        <PlansContext.Provider value={{plans, cancelSubscription, isCancelling}}>
            {children}
        </PlansContext.Provider>
    )
}

export const usePlans = () => {
    const context = React.useContext(PlansContext);
  
    if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
  
    return context;
};
  
