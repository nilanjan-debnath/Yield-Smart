import React, { useState } from 'react'

export default function ToggleBtn({setStatus, status}) {
    const [position, setPosition] = useState(false);

    const handleClick = () => {
        setPosition(!position);
        setStatus(()=> status === 'OFF'? 'ON' : 'OFF');
    }

  return (
    <button onClick={handleClick} className={`w-20 h-8 rounded-full border-2  relative px-1 ${position? 'bg-[#12CC94] border-blue-400' : 'bg-[#F1F6F5] border-[#12CC94]'} sm:w-20 xl:w-24 xl:h-12 transition-all duration-500`}>
      <div className={`absolute ${position? 'left-[78%] bg-white' : 'left-[22%] bg-[#12CC94]'} top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-500 xl:w-8 xl:h-8`}></div>
    </button>
  )
}
