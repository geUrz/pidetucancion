import { useEffect, useState } from 'react'
import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { BiMicrophone } from 'react-icons/bi'
import { BasicModal } from '@/layouts'
import { CancionesenfilaDetalles, ListaDeCancionesDetalles } from '../CancionesenfilaDetalles'
import { getValueOrDefault } from '@/helpers'
import styles from './CancionesenfilaLista.module.css'

export function CancionesenfilaLista(props) {

  const { user, reload, onReload, cancionesenfila, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [cancionenfilaSeleccionado, setCancionenfilaSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

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
    if (Array.isArray(cancionesenfila)) {
      const states = cancionesenfila.reduce((acc, cancion) => {
        const storedState = localStorage.getItem(`toggleMic_${cancion.id}`);
        acc[cancion.id] = storedState ? JSON.parse(storedState) : true;
        return acc;
      }, {});
      setMicStates(states);
    }
  }, [cancionesenfila]);
  

  // Maneja el estado toggleMic de cada canción
  const handleToggleMic = (id, newState) => {
    // Actualizamos el estado en localStorage
    localStorage.setItem(`toggleMic_${id}`, JSON.stringify(newState));
    
    // Actualizamos el estado local en el componente
    setMicStates(prevState => ({
      ...prevState,
      [id]: newState
    }));
  }

  return (

    <>

      {showLoading ? (
        <Loading size={45} loading={1} />
      ) : (
        size(cancionesenfila) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            <div className={styles.section}>
            {map(cancionesenfila, (cancionenfila) => (
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
          </div>
        )
      )}

      <BasicModal key={cancionenfilaSeleccionado?.id}  title='detalles de la canción' show={showDetalles} onClose={onCloseDetalles}>
        <CancionesenfilaDetalles user={user} reload={reload} onReload={onReload} cancionenfila={cancionenfilaSeleccionado} onCloseDetalles={onCloseDetalles} onToastSuccessDel={onToastSuccessDel} handleToggleMic={handleToggleMic} micState={micStates[cancionenfilaSeleccionado?.id]} />
      </BasicModal>

    </>

  )
}
