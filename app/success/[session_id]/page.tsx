"use client";
import { useAuth } from '@/context/AuthContext';
import toastStyle from '@/utils/toastStyle';
import axios from 'axios';
import React from 'react'
import { toast } from 'react-hot-toast';

const RenderBox = ({children}: {children: React.ReactNode}) => {

  return (
    <div className='w-full h-screen p-16 bg-gray-100'>
      <div className='w-4/5 m-auto rounded-lg block bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700'>
          {children}
      </div>
    </div>
  )
};

const Page = ({params}:any) => {

  const session_id = params.session_id;
  const {logout} = useAuth();

  try{
    if(!session_id){
      throw new Error('Invalid Session ID')
    }

    const getInfo = async () => {

      if (typeof window !== 'undefined') {
        var userData:any = localStorage.getItem('user');
        userData = JSON.parse(userData || '{}');

        if(userData?.id){
          await axios.get(`/api/transaction?session_id=${session_id}&user_id=${userData.id}`);
          setTimeout(()=> {
            logout();
          },5000);
        }
      }
    }
    getInfo();

    return (
      <RenderBox >
        <h3 className='text-xl text-bold text-green-600 mb-2'>Transaction Successful.</h3>
        <h5>Processing may take a while, your account will be updated soon.</h5>
        <h4>you will be logout now.</h4>
      </RenderBox>
    )

  }
  catch(err){
    return (
      <RenderBox >
        <h3 className='text-xl text-bold text-red-600 mb-2'>Invalid Transaction.</h3>
        <h5>There was somethig wrong with the transaction</h5>
      </RenderBox>
    )
  }
}

export default Page