require('dotenv').config()
const cors = require('cors');
const express = require('express');

const router = require('./router')
const initializeSocket = require('./socket')

const app = express()

app.use(express.json())
app.use(cors())
app.use('/api', router);

// Global variable onGoingGames is a gameId=>ChessGame mapping, which would store all the on going games.
global.onGoingGames = new Map()

const http = require('http')
const socketIO = require('socket.io')

const server = http.createServer(app)

initializeSocket(server)

app.get('/', (req, res) => {
    res.send('Play chess backend');
});

server.listen(process.env.PORT , () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
})


