// server.js
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // Creamos un servidor HTTP a partir de Express
  const httpServer = http.createServer(server)

  // Configuramos Socket.io
  const io = socketIo(httpServer)

  // Escuchamos conexiones WebSocket
  io.on('connection', (socket) => {
    console.log('Usuario conectado')

    // Escuchar el evento 'nuevaCancion' desde el cliente
    socket.on('nuevaCancion', (data) => {
      console.log('Canción recibida:', data) // Verifica que los datos sean correctos

      // Emitir el evento 'nuevaCancion' a todos los clientes conectados
      io.emit('nuevaCancion', {
        id: data.id,
        cancion: data.cancion,
        cantante: data.cantante,
        nombre: data.nombre,
        mensaje: data.mensaje,
        estado: data.estado
      })
    })

    socket.on('cancionEliminada', (deletedSongId) => {
      console.log('Canción eliminada con ID:', deletedSongId)
      io.emit('cancionEliminada', deletedSongId) // Notifica a todos los clientes
    })

    // Escuchar el evento de cambio de estado del micrófono
    socket.on('cambiarEstadoMic', (data) => {
      console.log('Cambio de estado del micrófono recibido:', data)

      // Emitir el cambio de estado a todos los clientes
      io.emit('estadoMicActualizado', {
        id: data.id,
        estado: data.estado
      })
    })

    // Evento de desconexión
    socket.on('disconnect', () => {
      console.log('Usuario desconectado')
    })
  })

  // Definir rutas para Next.js
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  // El servidor escucha en el puerto 3000
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
