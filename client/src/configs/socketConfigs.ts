import { io } from "socket.io-client";
import { reactive } from "vue";

export const socketState = reactive({
  connected: false,
  failed: false,
});

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  extraHeaders: {
    Authorization: `Bearer ${window.Telegram.WebApp.initData}`,
  },
});

socket.on("connect", () => {
  socketState.connected = true;
});

socket.on("disconnect", () => {
  socketState.connected = false;
});

socket.on("connect_error", (err) => {
  console.log(`Connection failed, ${err}`);
  socketState.failed = true;
});
