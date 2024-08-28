import React, { useState } from 'react'

export default function ToggleBtn() {
    const [position, setPosition] = useState(false);
    console.log("position: ", position);

    const handleClick = () => {
        setPosition(!position);
    }

  return (
    <button onClick={handleClick} className={`w-28 h-12 rounded-full border-2  relative px-1 ${position? 'bg-[#12CC94] border-blue-400' : 'bg-[#F1F6F5] border-[#12CC94]'} sm:w-28 md:w-36 md:h-14 transition-all duration-500`}>
      <div className={`absolute ${position? 'left-[82%] bg-white' : 'left-[18%] bg-[#12CC94]'} top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full transition-all duration-500 md:w-10 md:h-10`}></div>
    </button>
  )
}
