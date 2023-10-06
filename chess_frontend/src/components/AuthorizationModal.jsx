import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addPlayerId,
    addGameState,
    addSocket, 
    addMessage, 
    addTimeLeft, 
    addWinner, 
    addPopup
} from '../features/chess/chessSlice';

function AuthorizationModal({setShowModal}) {
    const dispatch = useDispatch()
    const [playerId, setPlayerId] = useState(null)
    const location = useLocation()
    
    const navigate = useNavigate()
    
    const handleClick = (e) => {
        e.preventDefault();
        if(!playerId){
            return 
        }
        const tmpArr = location.pathname.split("/")
        const gameId = tmpArr[tmpArr.length-1]
    
        let socket = io(process.env.REACT_APP_SERVER);

        socket.emit('validate_session', {gameId, playerId})

        // All socket listeners are created bellow.
        socket.on('validate_session', (response)=>{
            if(!response.ok){
                setTimeout(() => {
                    socket.disconnect()
                    dispatch(addGameState({gameState: null}))
                    navigate('/')
                }, 2000)
            }
        
            dispatch(addPlayerId({playerId}))
            dispatch(addSocket({socket:socket}))
        })

        socket.on('set_name', (data) => {
            console.log(data)
        })

        socket.on('new_game_state', (response) => {
            dispatch(addGameState({gameState: response.game}))
        })

        socket.on('messages', (response) => {
            dispatch(addMessage(response.messages))
        })

        socket.on('timeleft', (response) => {
            dispatch(addTimeLeft(response))
        })

        socket.on('timeout', (response) => {
            dispatch(addWinner(response))
        })

        socket.on('popup', (response) => {
            console.log('recieved pop up', response)
            dispatch(addPopup(response))
            setTimeout(() => {dispatch(addPopup(null))}, 3000)
        })

        setShowModal(false)
    }

    return (
        <div className='absolute w-full h-[100vh] flex flex-row items-center justify-center bg-black bg-opacity-50'>
            <div className='w-[300px] h-[300px] flex flex-col justify-center items-center bg-white  border-gray-400 border-[1.5px] rounded-md'>
                <p className='font-mono text-[18px] text-gray-500 mb-5'>Please enter your player Id</p>
                <input 
                onChange={(e)=>setPlayerId(e.target.value)}
                type='text'
                placeholder='player Id'
                className='outline-none border-gray-400 border-[1px] p-2 rounded-md mb-5'
                />
                <button 
                onClick={handleClick}
                className='text-center px-10 py-1 bg-green-200 outline-none border-green-800 border-[1px] rounded-md'
                >
                    Play
                </button>
            </div>
        </div>
    )
}

export default AuthorizationModal