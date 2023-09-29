import { Socket } from "socket.io";

const handleJoinGame = (socket: Socket, callback: (gameId: string) => void) => {
  socket.on("joinGame", (gameId) => {
    // TODO: handle join game
    // callback(gameId);
  });
};

export default handleJoinGame;
