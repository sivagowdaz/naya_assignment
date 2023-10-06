import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    playerId: '',
    gameState: null,
    gameId: '',
    socket: null,
    messages: [],
    timeLeft: {},
    popup: null
}

export const chessSlice = createSlice({
    name: 'chess',
    initialState,
    reducers: {
        addPlayerId: (state, action) => {
            state.playerId = action.payload.playerId
        },
        addGameId: (state, action) => {
            state.gameId = action.payload.gameId
        },
        addGameState: (state, action) => {
            state.gameState = action.payload.gameState
        },
        addSocket: (state, action) => {
            state.socket = action.payload.socket
        },
        addMessage: (state, action) => {
            state.messages = action.payload
        },
        addTimeLeft: (state, action) => {
            state.timeLeft = action.payload
        },
        addWinner: (state, action) => {
            state.gameState.winnerDetail = action.payload
        },
        addPopup: (state, action) => {
            state.popup = action.payload
        },
        updateFen: (state, action) => {
            state.gameState.fen = action.payload
        },
        resetEnded: (state, action) => {
            state.gameState.winnerDetail.ended = false
        },
    }
})

export const {
    addPlayerId, 
    addGameId, 
    addGameState, 
    addSocket, 
    addMessage, 
    addTimeLeft, 
    addWinner, 
    addPopup,
    updateFen, 
    resetEnded, 
} = chessSlice.actions
export default chessSlice.reducer