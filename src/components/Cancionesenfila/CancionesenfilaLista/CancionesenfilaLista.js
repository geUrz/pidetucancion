import { useEffect, useState } from 'react'
import { Confirm, ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { BiMicrophone } from 'react-icons/bi'
import { BasicModal } from '@/layouts'
import { CancionesenfilaDetalles } from '../CancionesenfilaDetalles'
import { getValueOrDefault } from '@/helpers'
import styles from './CancionesenfilaLista.module.css'

import io from 'socket.io-client'
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa'
import axios from 'axios'

export function CancionesenfilaLista(props) {

  const { user, reload, onReload, cancionesenfila, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [cancionenfilaSeleccionado, setCancionenfilaSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const [cancionesActualizadas, setCancionesActualizadas] = useState(cancionesenfila)

  useEffect(() => {
    setCancionesActualizadas(cancionesenfila)
  }, [cancionesenfila])  // Solo se actualiza si `cancionesenfila` cambia

  useEffect(() => {
    if (reload) {
      // Si se recarga, puedes hacer alguna lógica adicional si es necesario.
      // Como mostrar un spinner de carga, por ejemplo.
      onReload()  // Llama a onReload para actualizar la lista de canciones
    }
  }, [reload])

  const socket = io('http://localhost:3000')

  useEffect(() => {
    const fetchCanciones = async () => {
      try {
        const response = await fetch('/api/cancionesenfila/cancionesenfila')
        const data = await response.json()
        setCancionesActualizadas(data)  // Actualiza el estado con las canciones más recientes
      } catch (error) {
        console.error('Error al obtener las canciones:', error)
      }
    };

    fetchCanciones()  // Llamada al backend para obtener las canciones

    // Emitir evento para obtener las canciones actualizadas al conectarse
    socket.emit('getCanciones')

    socket.on('nuevaCancion', (nuevaCancion) => {
      // Asegurarnos de que la nuevaCancion tiene los datos correctos
      if (nuevaCancion && nuevaCancion.cancion && nuevaCancion.id) {
        setCancionesActualizadas((prevCanciones) => [...prevCanciones, nuevaCancion])
      } else {
        console.error('La nueva canción recibida tiene un formato incorrecto:', nuevaCancion)
      }
    })

    socket.on('cancionEliminada', (deletedSongId) => {
      setCancionesActualizadas((prev) =>
        prev.filter((cancion) => cancion.id !== deletedSongId)
      )
    })

    return () => {
      socket.off('nuevaCancion')
      socket.off('cancionEliminada')
    };
  }, [])

  const onOpenDetalles = (cancionenfila) => {
    setCancionenfilaSeleccionado(cancionenfila)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setCancionenfilaSeleccionado(null)
    setShowDetalles(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const [micStates, setMicStates] = useState({})

  useEffect(() => {
    // Solo ejecutamos el reduce si cancionesenfila es un arreglo válido
    if (Array.isArray(cancionesActualizadas)) {
      const states = cancionesActualizadas.reduce((acc, cancion) => {
        const storedState = localStorage.getItem(`toggleMic_${cancion.id}`)
        acc[cancion.id] = storedState ? JSON.parse(storedState) : true; // Valor por defecto true si no está en el localStorage
        return acc;
      }, {})
      setMicStates(states)
    }
  }, [cancionesActualizadas])



  const handleToggleMic = (id, newState) => {
    // Solo emitimos si el estado realmente cambió
    if (micStates[id] !== newState) {
      // Actualizamos el estado en localStorage
      localStorage.setItem(`toggleMic_${id}`, JSON.stringify(newState))

      // Actualizamos el estado local en el componente
      setMicStates((prevState) => ({
        ...prevState,
        [id]: newState,
      }))

      // Emitimos el evento solo si el estado cambió
      if (socket) {
        socket.emit('cambiarEstadoMic', { id, estado: newState })
      }
    }
  };

  useEffect(() => {
    socket.on('estadoMicActualizado', (data) => {
      const { id, estado } = data;

      // Actualizamos el estado de micrófono para la canción que recibió el cambio
      setMicStates((prevState) => ({
        ...prevState,
        [id]: estado,
      }))
    })

    return () => {
      socket.off('estadoMicActualizado')
    };
  }, [socket])

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const deleteAllSongs = async () => {
    try {
      // Usamos params para enviar usuario_id como parámetro en la URL
      const res = await axios.delete(`/api/cancionesenfila/cancionesenfila`, {
        params: { usuario_id: user.id }
      })

      if (res.status === 200) {
        setCancionesActualizadas([])
        onToastSuccessDel()
        setShowConfirmDel(false)
      }
    } catch (error) {
      console.error('Error al eliminar canciones:', error)
    }
  };


  return (

    <>

      {showLoading ? (
        <Loading size={45} loading={1} />
      ) : (
        size(cancionesActualizadas) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            <div className={styles.section}>
              {map(cancionesActualizadas, (cancionenfila) => (
                <div key={cancionenfila.id}
                  className={micStates[cancionenfila.id] ? `${styles.boxToggle}` : `${styles.box}`} onClick={() => onOpenDetalles(cancionenfila)}>
                  <div>
                    <div className={styles.column1}>
                      <BiMicrophone />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Canción</h1>
                        <h2>{getValueOrDefault(cancionenfila?.cancion)}</h2>
                      </div>
                      <div >
                        <h1>Nombre</h1>
                        <h2>{getValueOrDefault(cancionenfila?.nombre)}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {user && user.nivel === 'admin' &&
              <div className={styles.mainDelete}>
                <div className={styles.sectionDelete}>
                  <div>
                    <FaTrash onClick={onOpenCloseConfirmDel} />
                  </div>
                </div>
              </div>
            }

          </div>
        )
      )}

      <BasicModal key={cancionenfilaSeleccionado?.id} title='detalles de la canción' show={showDetalles} onClose={onCloseDetalles}>
        <CancionesenfilaDetalles user={user} reload={reload} onReload={onReload} cancionenfila={cancionenfilaSeleccionado} onCloseDetalles={onCloseDetalles} onToastSuccessDel={onToastSuccessDel} handleToggleMic={handleToggleMic} micState={micStates[cancionenfilaSeleccionado?.id]} />
      </BasicModal>

      <Confirm
        open={showConfirmDel}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={deleteAllSongs}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar todas las canciones ?'
      />

    </>

  )
}
