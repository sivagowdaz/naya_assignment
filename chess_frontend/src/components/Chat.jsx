import React, {useState} from 'react'
import { useSelector } from 'react-redux'

function Chat() {
    const messages = useSelector((state)=> state.messages)
    const playerId = useSelector((state)=> state.playerId)
    const socket = useSelector((state) => state.socket)
    const gameState = useSelector((state) => state.gameState)
    const [message, setMessage] = useState('')

    const handleSendMessage = (e) => {
        e.preventDefault()
        if(message.length > 0){
            socket.emit('new_message', {playerId:playerId, gameId:gameState.gameId, message:message})
            setMessage('')
        }
    }

    return (
        <div className='w-full h-full'>
            <div className='w-full h-[8%] flex flex-row items-center justify-center bg-gray-100 border-b-[1px] border-gray-600'>
                <p className='text-[25px] font-bold font-mono'>Chat Messages</p>
            </div>
            <div className='w-full h-[80%] overflow-y-scroll mt-3 px-2'>
                {
                    messages.map((message, index) => (
                        <div key={index} className='flex' style={{flex: 'row', justifyContent: message.from === playerId? 'right':'left'}}>
                            <div key={index} className='max-w-[70%] p-2 rounded-full mb-3' style={{backgroundColor: message.from === playerId? '#2E64FF':'#CBD8FD'}}>
                                <p className='text-sm font-mono' style={{color:message.from === playerId? 'white':'black' }}>{message.message}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='w-full px-2 flex flex-row justify-evenly items-center h-[8%] border-t-[1px] border-gray-600'>
                <input 
                onChange={(e)=>setMessage(e.target.value)}
                value={message}
                type='text' 
                placeholder='message'  
                className='outline-none px-3 rounded-full h-[70%] w-[80%] bg-[#CBD8FD] roundex-md placeholder:text-gray-700'
                />
                <button 
                onClick={handleSendMessage}
                className='outline-none text-white rounded-full h-[70%] w-[20%] bg-blue-700 color-white font-mono font-bold ml-2'>
                    Send
                </button>
            </div>
        </div>
    )
}

export default Chat