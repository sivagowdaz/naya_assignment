const { Chess } = require('chess.js')

class ChessGame {
    constructor(gameId, blackPlayerId, whitePlayerId, time=10){
        this.chess = new Chess()
        this.blackPlayer = new Player(blackPlayerId, time, 'black')
        this.whitePlayer = new Player(whitePlayerId, time, 'white')

        this.gameId = gameId
        this.messages = []
        this.gameEnded = false
        this.blackPlayerInterval = null
        this.whitePlayerInterval = null
    }

    makeMove(move){
        let isValid;
        // Invalid moves can give errors. So try-catch is used.
        try{
            this.chess.move(move)
            isValid = true
        }catch(e){
            isValid = false
        }
        return isValid
    }

    getFen(){
        return this.chess.fen()
    }
    
    getHistory(){
        return this.chess.history()
    }

    getTurn(){
        return this.chess.turn()
    }

    isGameOver(){
        return this.chess.isGameOver()
    }

    selectWinner() {
        if (this.chess.isCheckmate()) {
            if (this.chess.turn() === 'w') {
                return 'b'
            } else {
                return 'w'
            }
        } else if (this.chess.isDraw()) {
           return 'd'
        } else {
            return 'u'
        }
    }

    addMessage(message){
        this.messages.push(message)
    }

    getMessages(){
        return this.messages
    }

    /*
    getOpponentPlayer and getCurrentPlayer can be avoid by storing users
    as a map(playerId => Player).
    */
    getOpponentPlayer(playerId){
        if(this.whitePlayer.id != playerId){
            return this.whitePlayer
        }else{
            return this.blackPlayer
        }
    }

    getCurrentPlayer(playerId){
        let curPlayer = null
        if(this.whitePlayer.id == playerId){
            curPlayer = this.whitePlayer
        }
        if(this.blackPlayer.id == playerId){
            curPlayer = this.blackPlayer
        }
        return curPlayer
    }

    clearTimerIntervals(){
        if(this.blackPlayerInterval) clearInterval(this.blackPlayerInterval)
        if(this.whitePlayerInterval) clearInterval(this.whitePlayerInterval)
    }

    deleteGame(){
        global.onGoingGames.delete(this.gameId)
    }

    startWatchingForTimeUp(io){
        this.blackPlayerInterval = setInterval(() => {
            if(this.blackPlayer.moveIsActive){
                this.blackPlayer.remainingTime = this.blackPlayer.remainingTime - 1
                if(this.blackPlayer.remainingTime == 0){
                    this.gameEnded = true
                    if(this.blackPlayer.socketId) io.to(this.blackPlayer.socketId).emit('timeout', {ended:true, winner:'w'})
                    if(this.whitePlayer.socketId) io.to(this.whitePlayer.socketId).emit('timeout', {ended:true, winner:'w'})

                    if(this.blackPlayerInterval) clearInterval(this.blackPlayerInterval)
                    if(this.whitePlayerInterval) clearInterval(this.whitePlayerInterval)

                    // Deleting the game from memory after 24 hours(mainly to save memory).
                    setTimeout(() => {this.deleteGame()}, 86400000)
                }
                
                if(this.blackPlayer.socketId) io.to(this.blackPlayer.socketId).emit('timeleft', {black:this.blackPlayer.remainingTime, white:this.whitePlayer.remainingTime})
                if(this.whitePlayer.socketId) io.to(this.whitePlayer.socketId).emit('timeleft', {black:this.blackPlayer.remainingTime, white:this.whitePlayer.remainingTime})
            }
        }, 1000)

        this.whitePlayerInterval = setInterval(() => {
            if(this.whitePlayer.moveIsActive){
                this.whitePlayer.remainingTime = this.whitePlayer.remainingTime - 1
                if(this.whitePlayer.remainingTime == 0){
                    this.gameEnded = true
                    if(this.blackPlayer.socketId) io.to(this.blackPlayer.socketId).emit('timeout', {ended:true, winner:'b'})
                    if(this.whitePlayer.socketId) io.to(this.whitePlayer.socketId).emit('timeout', {ended:true, winner:'b'})

                    if(this.blackPlayerInterval) clearInterval(this.blackPlayerInterval)
                    if(this.whitePlayerInterval) clearInterval(this.whitePlayerInterval)
                    
                    // Deleting the game from memory after 24 hours(mainly to save memory).
                    setTimeout(() => {this.deleteGame()}, 86400000)
                }
                
                if(this.blackPlayer.socketId) io.to(this.blackPlayer.socketId).emit('timeleft', {black:this.blackPlayer.remainingTime, white:this.whitePlayer.remainingTime})
                if(this.whitePlayer.socketId) io.to(this.whitePlayer.socketId).emit('timeleft', {black:this.blackPlayer.remainingTime, white:this.whitePlayer.remainingTime})
            }
        }, 1000)
    }

}

class Player {
    constructor(id, time, color){
        this.id = id
        this.remainingTime = (time * 60)
        this.name = null
        this.connected = false
        this.color = color
        this.socketId = null

        this.moveStartTime = null
        this.moveEndTime = null
        /*
        moveIsActive = true represents, current chess move turn belogs to this player.
        When moveIsActive = true remainingTime decreases.
        */
        this.moveIsActive = false 
    }

    getId(){
        return this.id
    }

    getRemainingTime(){
        return this.remainingTime
    }
}

module.exports = ChessGame