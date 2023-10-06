const ChessGame = require('./chess_game')

const initiateChess = (req, res) => {
    const {gameId, player1Id, player2Id, timeLimit} = req.body
    if (!(gameId && player1Id && player2Id)){
        return res.status(400).json({response:"username and gameid are required"})
    }
    
    let newGame = new ChessGame(gameId, player1Id, player2Id, timeLimit)
    global.onGoingGames.set(gameId, newGame)
    return res.status(201).json({response:global.onGoingGames.get(gameId)})
}

const express = require('express');
const router = express.Router();

router.post("/init_chess", initiateChess)

module.exports = router