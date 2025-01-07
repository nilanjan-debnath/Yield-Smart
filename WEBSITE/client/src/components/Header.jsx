import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from "/images/logo.jpg";
import { BiSolidDashboard } from "react-icons/bi";
import Logo2 from "/images/dashboard/logoo.png";
import { useDispatch } from 'react-redux';
import {signInSuccess, signInStart, signInFailure} from "../redux/user/userSlice"
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTokenData();
  }, []);

  const fetchTokenData = async () => {
    try{
      dispatch(signInStart());
      const res = await fetch("/api/user/readToken");
      const data = await res.json();
      if(data.success === false){
        console.log("token data error: ", data.message);
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      console.log("user data: ", data);
    }catch(error){
      console.log("token fetch error: ", error.message);
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <header id='header' className='px-2 py-2 bg-[#9EFFE2] sm:px-4 h-[9dvh] border-b-2 border-[#4AD0DB]'>
      <div className="text-white flex justify-between items-center">
        <Link to='/dashboard'>
          <div className="flex gap-2 items-center">
            <img src={Logo} alt="" className="w-12 h-12 bg-yellow-200 rounded-full object-cover" />
            <img src={Logo2} alt="" className="h-10 sm:h-12" />
          </div>
        </Link>
        {currentUser ? (
          <div className="flex items-center gap-4">
            <Link to='/dashboard' title='Dashboard' className='text-xl font-semibold'><BiSolidDashboard className='text-3xl sm:text-4xl text-[#00623D]' /></Link>

            <Link to='/profile'>
              <div className="rounded-full overflow-hidden border-2 border-[#00623D] mx-2 w-10 sm:h-10">
                <img src={currentUser.avatar} alt="" className="w-full h-full object-contain" />
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 items-center px-2">
            <Link to='/dashboard' title='Dashboard' className='text-xl font-semibold'><BiSolidDashboard className='text-3xl sm:text-4xl text-[#00623D]' /></Link>
            <Link to='/sign-in' className="text-lg font-semibold sm:text-xl text-[#00623D]">Login</Link>
          </div>
        )}
      </div>
    </header>
  )
}
