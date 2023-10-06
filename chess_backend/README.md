# Let's Play Chess Backend
## Starting the server
1. Install all the necessary dependancies.
```
npm install
```
2. At the root directory create file named `.env` with variables
```
PORT = <port of your choice ex: 8000>
SOCKET_ORIGIN = <end point from where socket connection request is comming ex: http://localhost:3000>
```
3. Start the server
```
npm run start
```
Server should start listening at specified port.
## Brief description about the important files this project contains.
1. `app.js`: Socket with listeners ans emitters is initialized and server is started.
2. `chess_game.js`: Contains `ChessGame` and `Player` class which represents a chess game and players involved in the game.
3. `socket.js`: Contains all socket listeners and emitters.