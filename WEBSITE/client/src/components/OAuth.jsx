import React from 'react'
import googleLogo from "../../public/images/googleLogo.png"
import {GoogleAuthProvider, getAuth, signInWithPopup} from "firebase/auth";
import { app } from '../firebase';
import { signInSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async() => {
        try{
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            // console.log(result);
            const res = await fetch("/api/auth/google",{
               method: 'POST',
               headers: {
                'Content-Type': 'application/json',
               },
               body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}),
            })

            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');
        }catch(error){
            console.log("could not sign with google ", error);
        }
    }

  return (
    <button type='button' onClickCapture={handleGoogleClick} className='border-2 border-black flex justify-center items-center gap-4 p-[0.3rem] rounded-lg overflow-hidden transition-all duration-300 hover:rounded-full'>
        <img src={googleLogo} alt="" className="w-8" />
        <h3 className='text-xl font-semibold'>Google</h3>
    </button>
  )
}
