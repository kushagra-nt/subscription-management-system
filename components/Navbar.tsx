import React from 'react'
import { useAuth } from '@/context/AuthContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Button } from './ui/button';

const Navbar = () => {

    const {user, logout} = useAuth();

    return (
        <div className='w-full py-8 px-10 flex flex-row justify-between'>

            <div className='flex flex-row'>
                
            </div>
            <div className='flex flex-row gap-4'>
                <h3 className='m-auto text-indigo-900'>{`Hi ${user?.userName}`}</h3>
                <Button onClick={logout}>Logout</Button>
            </div>
        </div>
    )
}

export default Navbar