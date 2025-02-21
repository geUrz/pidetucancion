const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const next = require('next')
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // Sirve los archivos estáticos desde la carpeta 'public'
  server.use(express.static(path.join(__dirname, 'public')))

  // Crear servidor HTTP a partir de Express
  const httpServer = http.createServer(server)

  // Configurar Socket.IO
  const io = socketIo(httpServer, {
    cors: {
      origin: '*', // Permitir solicitudes desde cualquier origen
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`)

    // Escuchar cuando se crea una nueva canción
    socket.on('nuevaCancion', (cancion) => {
      console.log('Nueva canción recibida:', cancion)
      
      // Enviar notificación a todos los clientes conectados
      io.emit('notification', { 
        message: '¡ Nueva canción agregada !', 
        details: `Canción: ${cancion.cancion}` 
      })

      io.emit('nuevaCancion', {
        id: cancion.id,
        cancion: cancion.cancion,
        cantante: cancion.cantante,
        nombre: cancion.nombre,
        mensaje: cancion.mensaje,
        estado: cancion.estado,
      })

    })

    socket.on('cambiarEstadoMic', (data) => {
      console.log('Cambio de estado del micrófono recibido:', data);
      io.emit('estadoMicActualizado', {
        id: data.id,
        estado: data.estado,
      });
    });

    socket.on('cancionEliminada', (deletedSongId) => {
      console.log('Canción eliminada con ID:', deletedSongId);
      io.emit('cancionEliminada', deletedSongId); // Notificar a todos los clientes
    });

    // Escuchar el evento de eliminación de todas las canciones
    socket.on('cancionesEliminadas', () => {
      console.log('Todas las canciones han sido eliminadas');
      io.emit('cancionesEliminadas'); // Notificar a todos los clientes
    });

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.id}`)
    })
  })

  // Manejo de rutas de Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  })

  const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8084 : 3004);

console.log('NODE_ENV:', process.env.NODE_ENV);

httpServer.listen(PORT, '0.0.0.0', (err) => {  // Escuchar en todas las interfaces de red
  if (err) throw err;
  console.log(`> Ready on http://localhost:${PORT}`);
});
  
})
