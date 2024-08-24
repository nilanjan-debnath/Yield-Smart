import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRef } from 'react';

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user);
  const fileRef = useRef(null);

  return (
    <>
      <div className="w-full py-4 bg-[#9EFFE2] flex items-center justify-between px-4 border-b-2 border-[#4AD0DB] shadow-md sm:px-8">
        <Link to='/dashboard'>
          <FaArrowLeftLong className='text-2xl' />
        </Link>
      </div>

      <div className="border border-black flex flex-col items-center gap-4 py-8 px-4">
        <div onClick={()=> fileRef.current.click()} className="w-28 h-28 overflow-hidden rounded-full border-2 border-black cursor-pointer sm:w-32 sm:h-3">
          <img src={currentUser.avatar} alt="" className="w-full h-full object-contain" />
        </div>

        <div className="w-[95%] flex gap-4 flex-col items-center border-2 border-black py-4 px-2 my-4 sm:w-[30rem]">
          <input ref={fileRef} type="file" hidden/>
          <input type="text" className="w-full px-4 py-3 rounded-md border border-black outline-none" placeholder='Username' defaultValue={currentUser.username} autoComplete='off'/>
          <input type="email" className="w-full px-4 py-3 rounded-md border border-black outline-none" placeholder='Email' defaultValue={currentUser.email} autoComplete='off'/>
          <input type="password" className="w-full px-4 py-3 rounded-md border border-black outline-none" placeholder='Password' autoComplete='off'/>
          <button className="w-full px-4 py-3 bg-[#12CC94] text-white rounded-md sm:text-lg font-semibold transition-all duration-300 hover:bg-[#11A478] uppercase">Submit</button>

          <button className="w-full px-4 py-3 bg-red-500 text-white rounded-md sm:text-lg font-semibold transition-all duration-300 hover:bg-red-600 uppercase mt-4">Logout</button>
        </div>
      </div>
    </>
  )
}
