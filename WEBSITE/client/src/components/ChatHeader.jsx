import React, { useEffect, useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaClockRotateLeft } from "react-icons/fa6";

export default function ChatHeader({setIsOpen, isOpen, leftDivRef}) {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <div ref={leftDivRef} className="w-full h-[9%] bg-[#9EFFE2] flex items-center justify-between px-4 border-b-2 border-[#4AD0DB] shadow-md sm:px-8">
            <Link to='/dashboard'>
                <FaArrowLeftLong className='text-2xl' />
            </Link>
            <div className="flex items-center gap-4">
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden"><FaClockRotateLeft className='text-2xl' /></button>
                <Link to='/profile'>
                    <div className="rounded-full overflow-hidden border-2 border-[#00623D] mx-2 w-10 sm:h-10">
                        <img src={currentUser.avatar} alt="" className="w-full h-full object-contain" />
                    </div>
                </Link>
            </div>
        </div>
    )
}
