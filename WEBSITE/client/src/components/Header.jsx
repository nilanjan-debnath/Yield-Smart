import React, { useEffect } from 'react'
import LogoImg from "../../public/images/logo.jpg";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const {currentUser} = useSelector((state)=> state.user);
  console.log(currentUser);

  return (
    <header id='header' className='px-4 py-2 bg-blue-500'>
      <div className="text-white flex justify-between items-center">
        <Link to='/'>
          <div className="logo flex gap-2 items-center">
            <div className="image w-12 h-12 overflow-hidden rounded-full">
              <img src={LogoImg} alt="" className='w-full h-full object-cover' />
            </div>
            <h1 className="text-xl font-semibold"><span className="text-[#49FF00]">Yield</span><span className="text-[#F9F3DF]">Smart</span></h1>
          </div>
        </Link>
        {currentUser ? (
          <div className="flex items-center gap-4">
        <Link to='/disease' className='text-xl font-semibold'>Disease</Link>

          <Link to='/profile'>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white mx-2">
            <img src={currentUser.avatar} alt="" className="w-full h-full object-contain" />
          </div>
          </Link>
          </div>
        ): (
          <div className="flex gap-6 items-center px-2">
        <Link to='/disease' className='text-xl font-semibold'>Disease</Link>
            <Link to='/sign-in' className="text-xl font-semibold">Login</Link>
            <Link to='/sign-up' className="text-xl font-semibold">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  )
}
