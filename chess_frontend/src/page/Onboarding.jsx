import React, {useState} from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

function Onboarding() {
    const [timeLimit, setTimeLimit] = useState(null)
    const [gameCreds, setGameCreds] = useState(null)

    const navigate = useNavigate()

    const generateLink = async(e) => {
        e.preventDefault();
        const uniqueId = uuidv4();

        // Only taking first 8 charectors. 36 charectors are unnecessary.
        const player1Id = uuidv4().substring(0, 8)
        const player2Id = uuidv4().substring(0, 8)

        const headers = {
            'Content-Type': 'application/json'
          };
          
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({gameId:uniqueId, player1Id, player2Id, timeLimit:timeLimit}) // Convert your data to JSON format if needed
        };
        
        const response = await fetch(`${process.env.REACT_APP_SERVER}api/init_chess/`, requestOptions)
        if (response.ok){
           setGameCreds({gameId:uniqueId, player1Id, player2Id})
        }
    }

    const handleNavigation = (e) => {
        e.preventDefault();
        navigate(`/chess/${gameCreds.gameId}`)
    }

    return (
        <div className='space-y-10'>
            <div className='w-full border-b-2 border-gray-200 text-center py-3'>
                <span className='text-black text-[40px] font-bold font-mono'>WELCOME TO </span>
                <span className='text-green-600 text-[40px] font-bold font-mono'>LET'S PLAY</span>
                <span className='text-red-600 text-[50px] font-bold block font-mono'>CHESS</span>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <p className='mb-3 w-[700px] text-center text-gray-400 font-mono text-lg'>
                    This is a multiplayer chess web app. Generate the link and share link and playerId with your friends. You can set the time limit bellow(default is 10 min).
                </p>
                <input 
                type='number' placeholder='time limit'
                onChange={(e)=>setTimeLimit(e.target.value)}
                className='border-gray-400 text-center border-[1px] rounded-md outline-none w-[250px] text-[18px] text-gray-600 px-3'
                />
                <button 
                onClick={generateLink}
                className='outline-none mt-4 bg-green-700 p-2 text-white font-mono border-green-600 border-[2px] rounded-md'
                >
                    Generate Link
                </button>
            </div>
            <div className='w-full'>
                {
                    gameCreds && 
                    <div className='w-full text-center'>
                        <div className='w-[700px] flex flex-row mx-auto border-[1px] border-gray-400 rounded-md'>
                            <div className='p-2 w-5/6'>
                                <p className='text-[20px] font-mono text-gray-500'>Link: {`http://localhost:3000/chess/${gameCreds.gameId}`}</p>
                            </div>
                            <button className='outline-none w-1/6 border-l-2 border-gray-500'>Copy</button>
                        </div>
                        <div className='w-[300px] mt-2 mx-auto border-[1px] border-gray-400 rounded-md'>
                            <p className='text-[20px] font-mono text-gray-500'>Opponent Id: {gameCreds.player2Id}</p>
                            <p className='text-[20px] font-mono text-gray-500'>Your Id: {gameCreds.player1Id}</p>
                        </div>
                        <p className='text-[20px] mt-3 font-mono text-gray-400 text-center'>
                            Share above link with your friends, and enjoy chess!!
                        </p>
                        <button 
                        onClick={handleNavigation}
                        className='mt-6 p-2 border-[2px] border-green-800 outline-none text-center font-mono text-[27px] bg-green-200 text-green-800'>
                            Let's Play Chess
                        </button>
                    </div>
                }
            </div>
        </div>
  )
}

export default Onboarding