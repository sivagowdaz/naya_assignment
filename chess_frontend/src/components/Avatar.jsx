import React from 'react'

function Avatar({spelling}) {
  return (
    <div className='w-[45px] text-[30px] h-[45px] flex items-center justify-center bg-gray-200 rounded-full'>
        <p className='text-[30px] text-black font-mono font-bold'>
            {spelling}
        </p>
    </div>
  )
}

export default Avatar