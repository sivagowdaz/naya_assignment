import React from 'react'
import { useSelector } from 'react-redux'

function Timer({timeLeftFor}) {
    const remainingTime = useSelector((state) => state.timeLeft)

    const timeHelper = () => {
        let timeLeft = remainingTime[timeLeftFor]
        let minutes = parseInt(timeLeft/60)
        minutes = minutes < 10 ? `0${minutes}`:minutes

        let seconds = timeLeft % 60
        seconds = seconds < 10 ? `0${seconds}`:seconds
        return `${minutes}:${seconds}`
    }

    return (
        <div className='flex flex-row'>
            <p className='font-mono text-black mr-2'>Time Left</p>
            <p className='bg-gray-300 text-black px-1 rounded-md'>{timeHelper()}</p>
        </div>
    )
}

export default Timer