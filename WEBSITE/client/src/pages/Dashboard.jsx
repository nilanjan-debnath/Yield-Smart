import React, { useEffect, useState } from 'react'
import Logo from "/images/logo.jpg";
import { BsFillBellFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { CiTempHigh } from "react-icons/ci";
import { IoWater } from "react-icons/io5";
import { PiPottedPlantFill } from "react-icons/pi";
import { BsCloudRainHeavyFill } from "react-icons/bs";
import { IoIosSunny } from "react-icons/io";
import { Link } from 'react-router-dom';
import Logo2 from "/images/dashboard/logoo.png";
import UppBtn from "/images/dashboard/uppbtn.png";
import DownImg from "/images/dashboard/diagonesis.png";

import { app } from '../firebase';
import { getDatabase, onValue, ref } from "firebase/database";
import ToggleBtn from '../components/ToggleBtn';


export default function Dashboard() {
    const [sensorData, setSensorData] = useState(null);
    console.log("sensor data: ", sensorData);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('OFF');

    const database = getDatabase(app);

    useEffect(() => {
        fetchRealTimeDatabaseData();
    }, []);

    const fetchRealTimeDatabaseData = () => {
        try {
            setLoading(true);
            const sensorRef = ref(database, "Sensor");

            onValue(sensorRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setSensorData(data);
                }
                setLoading(false);
            }, 
            (error) => {
                console.error("realtime db error: ", error);
                setLoading(false); // Set loading to false in case of an error
            });
        } catch (error) {
            console.log("realtime db error: ", error);
            setLoading(false);
        }
    }

    return (
        <>
            {(!sensorData && loading) && (
                <div className="w-full h-screen absolute left-0 top-0 flex justify-center items-center bg-[#01D2A8] z-50">
                    <div className="border-8 border-t-8 border-t-white border-gray-300 rounded-full w-16 h-16 animate-spin"></div>
                </div>
            )}
            {(sensorData) && (
                <div>
                    <div id='header' className="header w-full h-16 bg-[#9EFFE2] flex justify-between items-center px-2 sm:px-4">
                        <Link to='/'>
                            <div className="flex gap-2 items-center">
                                <img src={Logo} alt="" className="w-12 h-12 bg-yellow-200 rounded-full object-cover" />
                                <img src={Logo2} alt="" className="h-10 sm:h-12" />
                            </div>
                        </Link>
                        <div className="flex gap-4 items-center sm:px-4">
                            <button className="p-2 rounded-full"><BsFillBellFill className='text-xl hidden sm:text-2xl sm:block text-[#00623D]' /></button>
                            <Link to='/profile' className="p-2 rounded-full bg-white"><FaUserAlt className='text-xl sm:text-2xl text-[#00623D]' /></Link>
                        </div>
                    </div>
                    <div className="box1 h-44 mx-4 my-4 relative md:mx-8 sm:h-60 md:h-[40dvh]">
                        <Link to='/chat' className="">
                            <img src={UppBtn} alt="" className="absolute top-0 left-0 h-28 sm:h-40 md:h-44 lg:h-[13rem]" />
                        </Link>
                        <Link to='/diagonasis' className="">
                            <img src={DownImg} alt="" className="absolute bottom-0 right-0 h-28 sm:h-40 md:h-44 lg:h-[13rem]" />
                        </Link>
                    </div>
                    <div className="box2 py-6 px-8 sm:px-6 md:px-8">
                        <h1 className="text-3xl py-2 font-semibold text-[#00623D] border-b-4 border-[#00623D]">Plant Monitoring</h1>
                        <div className="flex flex-col gap-4 py-4">
                            <div className="flex flex-col justify-center gap-6 sm:flex-row">
                                <div className="w-full bg-[#9EF4E6] rounded-md flex gap-2 items-center justify-around py-2 sm:w-[33%] lg:w-[25%] sm:flex-col sm:justify-normal">
                                    <div className="">
                                        <h2 className="text-lg text-center font-semibold md:text-2xl py-2">Temperature</h2>
                                        <div className="flex gap-2 items-center justify-center">
                                            <CiTempHigh className='h-8 w-8 sm:h-12 sm:w-12 text-[#00623D]' />
                                            <p className="p-1 bg-white rounded-sm font-semibold sm:p-2">{sensorData.temp_val}&deg; C</p>
                                        </div>
                                    </div>
                                    <div className="bg-white w-[50%] h-16 sm:h-28 sm:w-[60%]">
                                        <img src="https://firebasestorage.googleapis.com/v0/b/yield-smart-web.appspot.com/o/website%20image%2FCombo%20Chart.png?alt=media&token=a25054da-497f-4627-aaf5-2c5de871c448" alt="" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="w-full bg-[#9EF4E6] rounded-md flex gap-2 items-center justify-around py-2 sm:w-[33%] lg:w-[25%] sm:flex-col sm:justify-normal">
                                    <div className="">
                                        <h2 className="text-lg text-center font-semibold md:text-2xl py-2">Humidity</h2>
                                        <div className="flex gap-2 items-center justify-center">
                                            <IoWater className='h-8 w-8 sm:h-12 sm:w-12 text-blue-400' />
                                            <p className="p-1 bg-white rounded-sm font-semibold sm:p-2">{sensorData.humidity_val}%</p>
                                        </div>
                                    </div>
                                    <div className="bg-white w-[50%] h-16 sm:h-28 sm:w-[60%]">
                                        <img src="https://firebasestorage.googleapis.com/v0/b/yield-smart-web.appspot.com/o/website%20image%2FCombo%20Chart.png?alt=media&token=a25054da-497f-4627-aaf5-2c5de871c448" alt="" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="w-full bg-[#9EF4E6] rounded-md flex gap-2 items-center justify-around py-2 sm:w-[33%] lg:w-[25%] sm:flex-col sm:justify-normal">
                                    <div className="">
                                        <h2 className="text-lg text-center font-semibold md:text-2xl py-2">Soil Moisture</h2>
                                        <div className="flex gap-2 items-center justify-center">
                                            <PiPottedPlantFill className='h-8 w-8 sm:h-12 sm:w-12 text-green-500' />
                                            <p className="p-1 bg-white rounded-sm font-semibold sm:p-2">82%</p>
                                        </div>
                                    </div>
                                    <div className="w-[50%] h-20 sm:h-28 sm:w-[60%] flex flex-col justify-center items-center bg-white gap-2 md:gap-4">
                                        <p className='font-semibold'>Pump Status</p>
                                        <div className="flex items-center gap-4 uppercase lg:text-lg sm:flex-col sm:gap-1 lg:flex-row lg:gap-2 xl:gap-4">
                                        <h3 className="">{status}</h3>
                                        <ToggleBtn setStatus={setStatus} status={status} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 py-4">
                                <div className="flex flex-col justify-center gap-6 sm:flex-row">
                                    <div className="w-full bg-[#9EF4E6] rounded-md flex flex-col gap-2 px-2 py-2 sm:w-[33%] lg:w-[25%] sm:items-center sm:px-0">
                                        <h2 className="text-lg font-semibold md:text-2xl sm:text-center py-2">Soil Nutrients</h2>
                                        <ul className="flex gap-1 w-full sm:flex-col sm:gap-4 sm:w-[90%]">
                                            <li className="text-xs sm:text-base w-[33.3%] sm:w-full rounded-md bg-white py-2 px-2 sm:px-4"><span className='font-bold text-red-500'>N:</span> 150 mg/kg</li>
                                            <li className="text-xs sm:text-base w-[33.3%] sm:w-full rounded-md bg-white py-2 px-2 sm:px-4"><span className='font-bold text-red-500'>P:</span> 60 mg/kg</li>
                                            <li className="text-xs sm:text-base w-[33.3%] sm:w-full rounded-md bg-white py-2 px-2 sm:px-4"><span className='font-bold text-red-500'>K:</span> 90 mg/kg</li>
                                        </ul>
                                    </div>
                                    <div className="flex gap-2 w-full sm:gap-6 sm:w-[60%] lg:w-[52%]">
                                        <div className="w-[48%] bg-[#9EF4E6] rounded-md flex flex-col gap-2 items-center py-2">
                                            <h2 className="text-lg font-semibold md:text-2xl sm:text-center py-2">UV</h2>
                                            <div className="w-[80%] bg-white h-12 rounded-md flex justify-center sm:h-32">
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <IoIosSunny className='text-2xl sm:text-3xl' />
                                                    <h2 className="text-sm sm:text-base">Very Weak</h2>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-[48%] bg-[#9EF4E6] rounded-md flex flex-col gap-2 items-center py-2">
                                            <h2 className="text-lg font-semibold md:text-2xl sm:text-center py-2">Raining Status</h2>
                                            <div className="w-[80%] bg-white h-12 rounded-md flex justify-center sm:h-32">
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <BsCloudRainHeavyFill className='text-xl sm:text-2xl' />
                                                    <h2 className="text-sm sm:text-base">Not Raining</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
