import React from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ChatHeader() {

    const { currentUser } = useSelector((state) => state.user);

    return (
        <div className="w-full h-[9%] bg-[#9EFFE2] flex items-center justify-between px-4 border-b-2 border-[#4AD0DB] shadow-md sm:px-8">
            <Link to='/dashboard'>
                <FaArrowLeftLong className='text-2xl' />
            </Link>
            <Link to='/profile'>
                <div className="rounded-full overflow-hidden border-2 border-[#00623D] mx-2 w-10 sm:h-10">
                    <img src={currentUser.avatar} alt="" className="w-full h-full object-contain" />
                </div>
            </Link>
        </div>
    )
}
