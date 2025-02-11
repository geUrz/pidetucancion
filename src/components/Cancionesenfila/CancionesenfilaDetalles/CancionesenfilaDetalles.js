import { FaCheck, FaEdit, FaMicrophone, FaMicrophoneSlash, FaTimes, FaTrash } from 'react-icons/fa'
import { IconClose, Confirm } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getValueOrDefault } from '@/helpers'
import styles from './CancionesenfilaDetalles.module.css'

export function CancionesenfilaDetalles(props) {

  const { user, reload, onReload, cancionenfila, onCloseDetalles, toastSuccessDel, handleToggleMic, micState } = props

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const [toggleMic, setToggleMic] = useState(micState || true)

  // Actualizamos el estado de toggleMic en el localStorage y el estado local
  const onToggleMic = () => {
    const newState = !toggleMic;
    setToggleMic(newState);
    handleToggleMic(cancionenfila.id, newState);
  }

  const handleDeleteCliente = async () => {
    if (cancionenfila?.id) {
      try {
        await axios.delete(`/api/listadecanciones/listadecanciones?id=${cancionenfila.id}`)
        onReload()
        toastSuccessDel()
        onCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar la canción:', error)
      }
    } else {
      console.error('Canción o ID no disponible')
    }
  }

  useEffect(() => {
    setToggleMic(micState); // Establecemos el estado inicial cuando cambia micState
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
              <h1>Mensaje</h1>
              <h2>{getValueOrDefault(cancionenfila?.mensaje)}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Nombre</h1>
              <h2>{getValueOrDefault(cancionenfila?.nombre)}</h2>
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
        onConfirm={handleDeleteCliente}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar la canción ?'
      />

    </>

  )
}
