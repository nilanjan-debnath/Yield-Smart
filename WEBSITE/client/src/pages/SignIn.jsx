import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
// import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  console.log(formData);
  const {loading, error} = useSelector((state)=> state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
//   console.log(error);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
  // console.log(formData);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      console.log(data);
      if(data.success === false){
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    }catch(error){
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className='flex justify-center items-center h-[90vh] bg-[#C5FFF8]'>
      <div className="w-[28rem] p-4 rounded-3xl shadow-2xl bg-white">
        <h1 className='text-center text-3xl my-7'>Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center my-4 p-4 gap-4">
          <input type="email" placeholder='email' id='email' className='px-4 py-3 rounded-lg  border-2 border-gray-300' autoComplete='off' onChange={handleChange} />
          <input type="password" placeholder='password' id='password' className='px-4 py-3 rounded-lg border-2 border-gray-300' autoComplete='off' onChange={handleChange} />
          <p className="cursor-pointer font-semibold">Forget password ?</p>
          <button disabled={loading} className="bg-blue-600 text-xl text-white font-semibold w-full py-2 rounded-lg transition-all duration-300 hover:bg-blue-500 disabled:bg-blue-400">{loading ? 'Loading...': 'Login'}</button>
          {/* <OAuth /> */}
        </form>
        <p className='px-6 text-xs font-semibold my-4'>By continuing, you agree to AgriGrow's Terms of Service and acknowledge you've read our Privacy Policy.Notice all collection</p>
        <div className="flex gap-2 px-4 my-8">
          <p>Don't have an account ?</p>
          <Link to='/sign-up' className='text-blue-500 font-semibold'>SignUp</Link>
        </div>
        {error && (
          <p className='text-red-600 text-sm font-semibold px-4 text-center'>{error}</p>
        )}
      </div>
    </div>
  )
}