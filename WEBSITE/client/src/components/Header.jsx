import React, { useEffect } from 'react'
import LogoImg from "../../public/images/logo.jpg";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const {currentUser} = useSelector((state)=> state.user);

  return (
    <header id='header' className='px-2 py-2 bg-blue-500 sm:px-4 h-[9dvh]'>
      <div className="text-white flex justify-between items-center">
        <Link to='/'>
          <div className="logo flex gap-2 items-center">
            <div className="image w-10 h-10 overflow-hidden rounded-full sm:w-12 sm:h-12">
              <img src={LogoImg} alt="" className='w-full h-full object-cover' />
            </div>
            <h1 className="text-lg font-semibold sm:text-xl"><span className="text-[#49FF00]">Yield</span><span className="text-[#F9F3DF]">Smart</span></h1>
          </div>
        </Link>
        {currentUser ? (
          <div className="flex items-center gap-4">
        <Link to='/chat' className='text-xl font-semibold'>Chat</Link>

          <Link to='/profile'>
          <div className="rounded-full overflow-hidden border-2 border-white mx-2 w-10 sm:h-10">
            <img src={currentUser.avatar} alt="" className="w-full h-full object-contain" />
          </div>
          </Link>
          </div>
        ): (
          <div className="flex gap-6 items-center px-2">
        <Link to='/chat' className='text-lg font-semibold sm:text-xl'>Chat</Link>
            <Link to='/sign-in' className="text-lg font-semibold sm:text-xl">Login</Link>
            <Link to='/sign-up' className="text-lg font-semibold hidden sm:block sm:text-xl">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  )
}
