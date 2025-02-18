// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Creamos un servidor HTTP a partir de Express
  const httpServer = http.createServer(server);

  // Configuramos Socket.IO
  const io = socketIo(httpServer, {
    cors: {
      origin: '*', // Permitir solicitudes desde cualquier origen
      methods: ['GET', 'POST'],
    },
  });

  // Manejo de conexiones WebSocket
  io.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Escuchar el evento 'nuevaCancion' desde el cliente
    socket.on('nuevaCancion', (data) => {
      console.log('Canción recibida:', data);

      // Emitir el evento 'nuevaCancion' a todos los clientes conectados
      io.emit('nuevaCancion', {
        id: data.id,
        cancion: data.cancion,
        cantante: data.cantante,
        nombre: data.nombre,
        mensaje: data.mensaje,
        estado: data.estado,
      });
    });

    // Escuchar el evento de eliminación de canción
    socket.on('cancionEliminada', (deletedSongId) => {
      console.log('Canción eliminada con ID:', deletedSongId);
      io.emit('cancionEliminada', deletedSongId); // Notificar a todos los clientes
    });

    // Escuchar el evento de eliminación de todas las canciones
    socket.on('cancionesEliminadas', () => {
      console.log('Todas las canciones han sido eliminadas');
      io.emit('cancionesEliminadas'); // Notificar a todos los clientes
    });

    // Escuchar el evento de cambio de estado del micrófono
    socket.on('cambiarEstadoMic', (data) => {
      console.log('Cambio de estado del micrófono recibido:', data);
      io.emit('estadoMicActualizado', {
        id: data.id,
        estado: data.estado,
      });
    });

    // Evento de desconexión
    socket.on('disconnect', () => {
      console.log('Usuario desconectado');
    });
  });

  // Definir rutas para Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Usar siempre httpServer para producción y desarrollo
  const PORT = process.env.PORT || 3004;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
