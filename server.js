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

  const httpServer = http.createServer(server)

  const io = socketIo(httpServer)

  io.on('connection', (socket) => {
    console.log('Usuario conectado')

 
    socket.on('nuevaCancion', (data) => {
      console.log('Canción recibida:', data) 

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
      io.emit('cancionEliminada', deletedSongId)
    })

    socket.on('cancionesEliminadas', () => {
      console.log('Todas las canciones han sido eliminadas')
      io.emit('cancionesEliminadas');
    })

    socket.on('cambiarEstadoMic', (data) => {
      console.log('Cambio de estado del micrófono recibido:', data)

      io.emit('estadoMicActualizado', {
        id: data.id,
        estado: data.estado
      })
    })

    socket.on('disconnect', () => {
      console.log('Usuario desconectado')
    })
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  const PORT = process.env.PORT || 3004;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
