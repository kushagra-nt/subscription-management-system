"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {toast} from 'react-hot-toast';
import toastStyle from "@/utils/toastStyle";
import { User } from "@/constants/types";

type AuthContextData = {
    user: User | null,
    login: (
        email: string,
        password: string,
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    )=>{},
    logout: ()=>void,
    updateSubsriptionPlan: ()=>void
}

type AuthProviderProps = {
    children: ReactNode;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<any>(null);
    const [updateUserPlan, setUpdateUserPlan] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
        const storedUser = sessionStorage.getItem('user');
          // If there is stored user data, update our state with it

          if (storedUser) {
            const userData:User = JSON.parse(storedUser);
            setUser(userData);

            if(userData.subscriptionPlan!=='Free' && userData.subscriptionEndsAt && new Date(userData.subscriptionEndsAt) < new Date()){
                updateSubsriptionPlan();
            }
          }
          else{
            router.push("/login");
          }
        };
    
        fetchUser();
    }, []);

    useEffect(()=> {

        if(user?.email){
            const updateUserSubscription = async () => {
                try{
                    const res:any = await axios.get(`/api/user?userEmail=${user.email}`);
                    setUser(res.data.user);
                }
                catch(err){
                    toast.error('Error fetching user subscription plan',{
                        style: toastStyle
                    });
                    console.log(err);
                }
            };
            updateUserSubscription();
        }

    },[updateUserPlan]);

    const updateSubsriptionPlan = ()=>{
        setUpdateUserPlan(!updateUserPlan);
    }

    const login = async (
        email: string,
        password: string,
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    )=>{
        setIsLoading(true);

        try{
            const response = await axios.post('/api/login', {
                email,
                password
            });

            toast.success('Logged in successfully',{
                style: toastStyle
            })

            setUser(response.data.user);
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
            setIsLoading(false);
            router.push("/");
        }
        catch(err:any){
            toast.error(`${err.response?.data?.message || 'Uhh oh! something went wrong'}`,{
                style: toastStyle
            });
            console.log(err);
            setIsLoading(false);
        }
    }

    const logout = ()=>{
        setUser(null);
        sessionStorage.removeItem('user');
        // toast.success("Logged Out Successfully!", { style: toastStyle });
        router.push("/login");
    }

    return (
        <AuthContext.Provider value={{user, updateSubsriptionPlan, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
  
    if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
  
    return context;
};
  