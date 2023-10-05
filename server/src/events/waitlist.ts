import { Socket } from "socket.io";
import { getWailList } from "../util/game-util";

// Join wailist room and return list of users in game to asking user
const handleGetWaitListGame = (socket: Socket) => {
  socket.on("getWaitList", async (gameId: number, callback) => {
    try {
      // Join waitList socket room
      socket.join(gameId.toString());

      // Get wait list
      const waitList = await getWailList(gameId);

      // Return wait list to current user
      callback({
        status: 200,
        waitList: waitList,
      });
    } catch (error) {
      callback({
        status: 500,
        message: "Getting wait list failed!",
      });
    }
  });
};

export default handleGetWaitListGame;
