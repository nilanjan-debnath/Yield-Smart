import React from 'react'

export default function LineBar({ rating}) {
    // const progress =Math.round((rating / 5) * 100);
    return (
        <div className='flex gap-4 items-center'>
            <h3 className="uppercase font-semibold">Ig :</h3>
            <div className="w-40 h-2 border rounded overflow-hidden relative bg-[#CDFADB] z-10">
                <div style={{ width: `${rating}%` }} className="h-full bg-[#FDA403] absolute left-0 top-0 z-20"></div>
            </div>
            <h3 className="">{rating}%</h3>
        </div>
    )
}
