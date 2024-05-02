import React from 'react'
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'

export default function Footer() {
    return (
        <div>
            <footer>
                <div className='bg-[#232f3e] text-gray-300 px-2'>
                    <HashLink smooth to='#header'>
                        <button className='w-full text-center text-xl font-semibold bg-[#314153] py-3 hover:bg-[#33455b]'>Back
                            to Top</button>
                    </HashLink>
                    <div className="flex gap-6 justify-around py-6 flex-wrap">
                        <div className="">
                            <h1 className="text-lg font-semibold text-white">Get to Know Us</h1>
                            <ul className='flex flex-col gap-2'>
                                <Link to='/about'>
                                    <li>About Us</li>
                                </Link>
                                <li className='cursor-pointer'>Careers</li>
                                <li className='cursor-pointer'>Press Releases</li>
                                <li className='cursor-pointer'>AgriGrow Science</li>
                            </ul>
                        </div>
                        <div className="">
                            <h1 className="text-lg font-semibold text-white">Connect with Us</h1>
                            <ul className='flex flex-col gap-2'>
                                <li className='cursor-pointer'>Facebook</li>
                                <li className='cursor-pointer'>Instagram</li>
                                <li className='cursor-pointer'>Twitter</li>
                            </ul>
                        </div>
                        <div className="">
                            <h1 className="text-lg font-semibold text-white">Grow with Us</h1>
                            <ul className='flex flex-col gap-2'>
                                <li className='cursor-pointer'>Connect with AgriGrow</li>
                                <li className='cursor-pointer'>AgriGrow Global Selling</li>
                                <li className='cursor-pointer'>Protect and Build Your Crop</li>
                                <li className='cursor-pointer'>Become an Affiliate</li>
                                <li className='cursor-pointer'>Fulfilment by AgriGrow</li>
                            </ul>
                        </div>
                        <div className="">
                            <h1 className="text-lg font-semibold text-white">Let Us Help You</h1>
                            <ul className='flex flex-col gap-2'>
                                <li className='cursor-pointer'>100% Protection</li>
                                <li className='cursor-pointer'>Returns Centre</li>
                                <li className='cursor-pointer'>Your Account</li>
                                <Link to='/'>
                                    <li>Help</li>
                                </Link>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
