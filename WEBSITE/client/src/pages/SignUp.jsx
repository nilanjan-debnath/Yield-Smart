import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(formData);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

    const data = await res.json();
    console.log(data);

    if(data.success === false){
      setLoading(false);
      setError(data.message);
      return
    }
    setLoading(false);
    setError(null);
    navigate('/sign-in');
    }catch(error){
      setLoading(false);
      setError(error.message);
    };
  };

  return (
    <div className='flex justify-center items-center h-[90vh] bg-[#C5FFF8]'>
      <div className="w-[28rem] p-4 rounded-3xl shadow-2xl bg-white">
        <h1 className='text-center text-3xl my-7'>Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col justify-center my-4 p-4 gap-4">
          <input type="text" placeholder='Username' id='username' className='px-4 py-3 rounded-lg  border-2 border-gray-300' autoComplete='off' onChange={handleChange} />
          <input type="email" placeholder='email' id='email' className='px-4 py-3 rounded-lg  border-2 border-gray-300' autoComplete='off' onChange={handleChange} />
          <input type="password" placeholder='password' id='password' className='px-4 py-3 rounded-lg border-2 border-gray-300' autoComplete='off' onChange={handleChange} />
          <button disabled={loading} className="bg-blue-600 text-xl text-white font-semibold w-full py-2 rounded-lg transition-all duration-300 hover:bg-blue-500 disabled:bg-blue-400">{loading ? 'Loading...': 'Sign Up'}</button>
          {/* <OAuth /> */}
        </form>
        <p className='px-6 text-xs font-semibold my-4'>By continuing, you agree to YieldSmart's terms of service and acknowledge you've read our privacy policy.</p>
        <div className="flex gap-2 px-4 my-8">
          <p>Already have an account?</p>
          <Link to='/sign-in' className='text-blue-500 font-semibold'>Login</Link>
        </div>
      {error && (
        <p className="text-red-600 text-sm font-semibold px-4 text-center">{error}</p>
      )}
      </div>
    </div>
  )
}