import React, {useEffect, useState} from 'react'
import { updateFen } from '../features/chess/chessSlice';
import { Chessboard } from "react-chessboard";
import { useLocation } from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux'
import AuthorizationModal from '../components/AuthorizationModal';
import { Chess as chessGame } from 'chess.js'
import WinnerPopup from '../components/WinnerPopup';
import Chat from '../components/Chat';
import Avatar from '../components/Avatar';
import MoveHistory from '../components/MoveHistory';
import Timer from '../components/Timer';
import Popup from '../components/Popup';

function Chess() {
    const gameState = useSelector((state)=>state.gameState)
    const playerId = useSelector((state)=>state.playerId)
    const socket = useSelector((store)=>store.socket)

    const [showModal, setShowModal] = useState(true)
    const [showSetName, setShowSetName] = useState(false)
    const [username, setUserName] = useState((gameState) ? gameState.player1.name ? gameState.player1.name : 'Not set':'Not set')
    
    const location = useLocation()
    
    const dispatch = useDispatch()

    const cleanupOnTabClose = (socket, playerId) => {
        const tmpArr = location.pathname.split("/")
        const gameId = tmpArr[tmpArr.length-1]
        socket.emit('client_disconnected', {gameId, playerId});
    }

    useEffect(() => {
        if(socket){
            window.addEventListener('beforeunload', () =>cleanupOnTabClose(socket, playerId));
        }
        
        return () => {
            window.removeEventListener('beforeunload', cleanupOnTabClose);
        };
    }, [socket]);

    const setName = (e) => {
        e.preventDefault();
        socket.emit('set_name', {playerId, name:username, gameId:gameState.gameId})
        setShowSetName(false)
    }
    
    /* 
    We are checking for move validation at back-end as well. But to mitigate the lag move
    is checked in front-end as well.
    */
    function makeAMove(move) {
        let isValid = false
        if(gameState){
            const game = new chessGame(gameState.fen);
            try{
                isValid = game.move(move);
                dispatch(updateFen(game.fen()))
            }catch (e){
                console.log(e)
            }
        }
        return isValid; // null if the move was illegal, the move object if the move was legal
    }

    function handleDrop(sourceSquare, targetSquare, piece) {
        let promotionPiece = piece.substring(1,2).toLowerCase()
        let moveAttr = {
            from: sourceSquare,
            to: targetSquare,
            promotion:promotionPiece
        }

        const move = makeAMove(moveAttr);
        
        if (!move) return false;

        socket.emit('new_move', {moveAttr, gameId: gameState.gameId, playerId})
        socket.on('new_move', (response)=>{
            if(!response.ok){
                console.log('invalid move')
            }
        })
        return true;
    }

    return (
        <div>
            {
                showModal && 
                    <AuthorizationModal 
                setShowModal={setShowModal} 
                />
            }
            {
                gameState && gameState.winnerDetail.ended && <WinnerPopup/>
            }
            <Popup/>
            {
                gameState &&
                <div className='w-full h-[100vh] flex flex-row'>
                    <div className='flex flex-row justify-center items-center w-[55%] border-r-[1px] h-full border-gray-500'>
                        <div>
                            <div>
                                <div>
                                    {
                                        !gameState.player2.connected ? 
                                            <div className='flex flex-row items-center justify-center mb-3'>
                                                <p className='font-mono text-gray-500'>Waiting for opponent to join...</p>
                                            </div>
                                        :
                                            <div className='flex flex-row items-center justify-between mb-3'>
                                                <div className='flex flex-row items-center'>
                                                    <Avatar spelling={gameState.player2.name?gameState.player2.name.substring(0,1).toUpperCase():'U'}/>
                                                    <p className='ml-3 font-mono'>{gameState.player2.name ? gameState.player2.name:'Not Set'}</p>
                                                </div>
                                                <Timer 
                                                    timeLeftFor={gameState.player2.color}
                                                />
                                            </div>
                                    }
                                </div>
                            </div>
                            <Chessboard 
                            id="BasicBoard"
                            position={gameState ? gameState.fen : new chessGame().fen()}
                            boardWidth={550}
                            arePiecesDraggable={gameState?new chessGame(gameState.fen).turn() === gameState.player1.color.substring(0,1)?true:false:false}
                            onPieceDrop={(sourceSquare, targetSquare, piece)=>handleDrop(sourceSquare, targetSquare, piece)}
                            onPromotionCheck={(sourceSquare, targetSquare, piece) => (((piece === "wP" && sourceSquare[1] === "7" && targetSquare[1] === "8") || (piece === "bP" && sourceSquare[1] === "2" && targetSquare[1] === "1")) && Math.abs(sourceSquare.charCodeAt(0) - targetSquare.charCodeAt(0)) <= 1)}
                            boardOrientation={gameState? gameState.player1.color.substring(0,1) === 'w' ? 'white':'black':'black'}
                            promotionDialogVariant='basic'
                            />
                            <div>
                                <div className='flex flex-row mt-3 items-center justify-between'>
                                    <div className='flex flex-row items-center'>
                                    <Avatar  spelling={gameState.player1.name ? gameState.player1.name.substring(0,1).toUpperCase():'U'}/>
                                    {
                                        showSetName ?
                                        <div className='ml-3'>
                                            <input
                                            type='text'
                                            placeholder={(gameState) ? gameState.player1.name ? gameState.player1.name : 'Not set':'Not set'}
                                            onChange={e=>setUserName(e.target.value)}
                                            className='outline-none w-[120px] border-b-[1px] border-gray-500'
                                            />
                                            <button 
                                            onClick={setName}
                                            className='px-1 ml-[20px] font-mono text-sm border-[1px] text-black border-gray-600 rounded-md'
                                            >
                                                Set
                                            </button>
                                        </div>
                                        :
                                        <div className='flex flex-row items-center ml-3'>
                                            <p className='font-mono'>{gameState.player1.name ? gameState.player1.name : 'Not set'}</p>
                                            <button 
                                            onClick={()=>setShowSetName((prev) => !prev)}
                                            className='px-1 ml-[60px] font-mono text-sm border-[1px] text-black border-gray-600 rounded-md'
                                            >
                                                Set
                                            </button>
                                        </div>
                                    }           
                                    </div>
                                    <Timer 
                                        timeLeftFor = {gameState.player1.color}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-center w-[20%] border-r-[1px] h-full border-gray-500'>
                        <MoveHistory/>
                    </div>
                    <div className='w-[25%]'>
                        <Chat/>
                    </div>
                </div>
            }
        </div>
    )
}

export default Chess