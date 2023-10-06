import React from 'react'
import {useSelector} from 'react-redux'
import { useDispatch } from 'react-redux';
import { resetEnded } from '../features/chess/chessSlice';

function WinnerPopup() {
    const gameState = useSelector((state)=>state.gameState)
    const dispatch = useDispatch()

    const handleClick = (e) => {
        e.preventDefault()
        dispatch(resetEnded())
    }

    return (
        <div className='absolute w-full h-[100vh] flex flex-row items-center bg-black bg-opacity-50'>
            <div className='w-[400px] h-[200px] flex flex-col ml-[55%] items-center justify-center bg-white  border-gray-400 border-[1.5px] rounded-md'>
                {
                    gameState.winnerDetail.winner === 'd' ? 
                        <div className='text-center mx-auto'>
                            <p className="text-[30px] font-bold font-mono text-gray-600">Oops!!!</p>
                            <p className='text-[20px] font-mono text-yellow-700'>Game ended with draw</p>
                        </div>
                        :
                        gameState.player1.color.substring(0,1) === gameState.winnerDetail.winner ?
                            <div className='text-center mx-auto'>
                                <p className="text-[30px] font-bold font-mono text-gray-600">Congratulations!!</p>
                                <p className='text-[20px] font-mono text-green-500'>You won the match</p>
                            </div>
                            :
                            <div className='text-center mx-auto'>
                                <p className="text-[30px] font-bold font-mono text-gray-600">Ohh No!!</p>
                                <p className='text-[20px] font-mono text-red-600'>You lost the match</p>
                            </div>
                }
                <button
                onClick={handleClick}
                className='outline-none border-gray-500 border-[1px] rounded-md px-3 py-2 mt-3 bg-gray-100 text-center'
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default WinnerPopup