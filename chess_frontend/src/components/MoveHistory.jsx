import React from 'react'
import {useSelector} from 'react-redux'

function MoveHistory() {
    const  moveHistory = useSelector((state)=> state.gameState.history)

    return (
        <div className='w-full h-full'>
            <div className='w-full h-[8%] flex flex-row items-center justify-center bg-gray-100 border-b-[1px] border-gray-600'>
                <p className='text-[25px] font-bold font-mono'>Move History</p>
            </div>
            <div className='w-full overflow-y-scroll'>
                <div className='flex w-full flex-row flex-wrap'>
                    {
                        moveHistory.map((move, index) => (
                            <div key={index} 
                            className='w-[50%] flex flex-row justify-center my-4'
                            >   
                                <div
                                className='w-fit px-1 rounded-[5px] flex flex-row justify-center items-center'
                                style={{backgroundColor:index%2===0?'white':'black', color:index%2===0?'black':'white', border:index%2===0?'1px solid black':'1px solid white'}}
                                >
                                    <p className='font-mono text-sm'>{move}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default MoveHistory