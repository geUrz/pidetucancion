import { FaCheck, FaEdit, FaMicrophone, FaMicrophoneSlash, FaTimes, FaTrash } from 'react-icons/fa'
import { IconClose, Confirm } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getValueOrDefault } from '@/helpers'
import styles from './CancionesenfilaDetalles.module.css'

import { useSocket } from '@/contexts/SocketContext'


export function CancionesenfilaDetalles(props) {

  const { user, reload, onReload, cancionenfila, onCloseDetalles, onToastSuccessDel, handleToggleMic, micState } = props

  const socket = useSocket()

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const [toggleMic, setToggleMic] = useState(micState || true)

  const onToggleMic = () => {
    const newState = !toggleMic;
    setToggleMic(newState);
    handleToggleMic(cancionenfila.id, newState);
  }

  const handleDeleteCancion = async () => {
    if (cancionenfila?.id) {
      try {
        await axios.delete(`/api/cancionesenfila/cancionesenfila?id=${cancionenfila.id}`)

        if (socket) {
          socket.emit('cancionEliminada', cancionenfila.id);
        }

        onReload(cancionenfila.id)
        onToastSuccessDel()
        onCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar la canción:', error)
      }
    } else {
      console.error('Canción o ID no disponible')
    }
  }

  useEffect(() => {
    setToggleMic(micState)
  }, [micState])

  return (

    <>

      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Canción</h1>
              <h2>{getValueOrDefault(cancionenfila?.cancion)}</h2>
            </div>
            <div>
              <h1>Nombre</h1>
              <h2>{getValueOrDefault(cancionenfila?.nombre)}</h2>
            </div>
            <div>
              <h1>Mensaje</h1>
              <h2>{getValueOrDefault(cancionenfila?.mensaje)}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
          <div>
              <h1>Cantante</h1>
              <h2>{getValueOrDefault(cancionenfila?.cantante)}</h2>
            </div>
          </div>
        </div>


        {user && user.nivel === 'admin' ?

          <div className={styles.iconFooter}>
            {toggleMic ?
              <div className={styles.iconMic}>
                <div onClick={onToggleMic}>
                  <FaMicrophone />
                </div>
              </div> :
              <div className={styles.iconMicOFF}>
                <div onClick={onToggleMic}>
                  <FaMicrophoneSlash />
                </div>
              </div>
            }
            <div className={styles.iconDel}>
              <FaTrash onClick={onOpenCloseConfirmDel} />
            </div>
          </div> : null
        }

      </div>

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
        onConfirm={handleDeleteCancion}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar la canción ?'
      />

    </>

  )
}
