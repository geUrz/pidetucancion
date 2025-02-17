import { Server } from 'socket.io';

export default function handler(req, res) {
  console.log("Handler de socket.js ejecutado");

  if (req.method !== 'OPTIONS') {
    if (res.socket.server.io) {
      console.log("Socket.IO ya está corriendo");
      res.end();
      return;
    }

    console.log("Socket.IO server initializing...");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      transports: ["websocket", "polling"], // ✅ Aseguramos que ambos transportes están habilitados
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log(`Cliente conectado: ${socket.id}`);

      socket.on("cancion-creada", (data) => {
        console.log("Canción creada:", data);
        io.emit("actualizar-canciones", data);
      });

      socket.on("disconnect", () => {
        console.log(`Cliente desconectado: ${socket.id}`);
      });
    });

    res.socket.server.io = io;
    res.end();
  }
}
