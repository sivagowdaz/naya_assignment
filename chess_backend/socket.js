const socketIO = require('socket.io');
require('dotenv').config()

const emitState = (io, socket, gameId, playerId) => {
    let game = global.onGoingGames.get(gameId)

    let currentPlayer = game.getCurrentPlayer(playerId)
    let currentPlayerDetail = {
        color: currentPlayer.color,
        connected: currentPlayer.connected,
        name: currentPlayer.name,
        remainingTime: currentPlayer.remainingTime
    }
    
    let opponent = game.getOpponentPlayer(playerId)
    let opponentPlayerDetail = {
        color: opponent.color,
        connected: opponent.connected,
        name:opponent.name,
        remainingTime: opponent.remainingTime
    }

    let winnerDetail = {
        ended: false,
    }

    if(game.isGameOver()){
        game.gameEnded = true
        game.clearTimerIntervals()

        let res = game.selectWinner()
        winnerDetail.ended = true,
        winnerDetail.winner = res

        // Deleting the game from memory after 24 hours(mainly to save memory).
        if(!game.gameEnded) setTimeout(() => {this.deleteGame()}, 86400000)
    }

    socket.emit('new_game_state', {game:{gameId:gameId,fen:game.getFen(), history:game.getHistory(), winnerDetail:winnerDetail, player1:currentPlayerDetail, player2: opponentPlayerDetail}})
    let opponentPlayerSocketId = opponent.socketId
    if (opponentPlayerSocketId){
        io.to(opponentPlayerSocketId).emit('new_game_state', {game:{gameId:gameId, fen:game.getFen(), history:game.getHistory(), winnerDetail:winnerDetail , player1:opponentPlayerDetail, player2: currentPlayerDetail}})
    }
}

const emitMessages = (io, socket, gameId, playerId) => {
    let game = global.onGoingGames.get(gameId)
    let messages = game.messages
    socket.emit('messages', {messages:messages})

    let opponentPlayerSocketId = game.getOpponentPlayer(playerId).socketId
    if(opponentPlayerSocketId){
        io.to(opponentPlayerSocketId).emit('messages', {messages:messages})
    }
}

function initializeSocket(server) {
    const io = socketIO(server, {cors: {
        origin: process.env.SOCKET_ORIGIN,
        credentials: true,
    }});

    io.on('connection', (socket) => {
        socket.on('validate_session', ({gameId, playerId}) => {
            if (global.onGoingGames.has(gameId)){
                let game = global.onGoingGames.get(gameId)
                let currentPlayer = game.getCurrentPlayer(playerId) 
                if(!currentPlayer){
                    socket.emit('validate_session', {ok:false, msg:'Invalid player Id'})
                    socket.emit('popup', {type:'error', msg:'Invalid player Id'})
                }else{
                    if(game.gameEnded){
                        socket.emit('validate_session', {ok:false, msg:'Game ended'})
                        socket.emit('popup', {type:'error', msg:'Game already ended'})
                    }else{
                        currentPlayer.socketId = socket.id
                        currentPlayer.connected = true
                        socket.emit('validate_session', {ok:true, msg:'success'})
                        socket.emit('popup', {type:'success', msg:'Sessionnn validated'})
                        if(currentPlayer.connected && game.getOpponentPlayer(playerId).connected){
                            game.startWatchingForTimeUp(io)
                            if(game.getTurn() == 'w'){
                                game.whitePlayer.moveIsActive = true
                            }else{
                                game.blackPlayer.moveIsActive = true
                            }
                        }
    
                        emitState(io, socket, gameId, playerId )
                        emitMessages(io, socket, gameId, playerId)
                    }
                }
            }else{
                socket.emit('validate_session', {ok:false, msg:'Invalid game Id'})
                socket.emit('popup', {type:'error', msg:'Invalid game Id'})
            }
        });

        socket.on('set_name', ({playerId, gameId, name}) => {
            if(global.onGoingGames.has(gameId)){
                let game = global.onGoingGames.get(gameId)
                let currentPlayer = game.getCurrentPlayer(playerId)
                if(!currentPlayer){
                    socket.emit('popup', {type:'error', msg:'Invalid player Id'})
                }else{
                    currentPlayer.name = name
                    socket.emit('popup', {type:'success', msg:'Name updated successfully'})

                    emitState(io, socket, gameId, playerId )
                }
            }
        })

        socket.on('new_move', ({moveAttr, gameId, playerId}) => {
            if(global.onGoingGames.has(gameId)){
                let game = global.onGoingGames.get(gameId)
                let isValid = game.makeMove(moveAttr)
                
                if(isValid){
                    let currentPlayer = game.getCurrentPlayer(playerId)
                    currentPlayer.moveIsActive = false
                    
                    socket.emit('new_move', {ok:true, msg:'success'})
                    emitState(io, socket, gameId, playerId )

                    let opponentPlayer = game.getOpponentPlayer(playerId)
                    opponentPlayer.moveIsActive = true
                }else{
                    socket.emit('popup', {type:'error', msg:'Invalid move'})
                }
            }
        })

        socket.on('new_message', ({gameId, playerId, message}) => {
            let game = global.onGoingGames.get(gameId)
            game.addMessage({from:playerId,message:message})

            emitMessages(io, socket, gameId, playerId)
        })
        
        socket.on('client_disconnected', ({playerId, gameId}) => {
            if(global.onGoingGames.has(gameId)){
                game = global.onGoingGames.get(gameId)
                let currentPlayer = game.getCurrentPlayer(playerId) 
                currentPlayer.connected = false
                currentPlayer.moveIsActive = false
                game.clearTimerIntervals()
                
                emitState(io, socket, gameId, playerId )
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}

module.exports = initializeSocket;
