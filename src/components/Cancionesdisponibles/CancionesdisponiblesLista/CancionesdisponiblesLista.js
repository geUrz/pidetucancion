import { useEffect, useState } from 'react'
import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { BiMicrophone } from 'react-icons/bi'
import { BasicModal } from '@/layouts'
import { CancionesdisponiblesDetalles } from '../CancionesdisponiblesDetalles'
import { getValueOrDefault } from '@/helpers'
import styles from './CancionesdisponiblesLista.module.css'

export function CancionesdisponiblesLista(props) {

  const { user, reload, onReload, listadecanciones, onToastSuccess, onToastSuccessMod, onToastSuccessDel } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [listadecancionesSeleccionado, setListadecancionesSeleccionado] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (listadecancion) => {
    setListadecancionesSeleccionado(listadecancion)
    setShowDetalles(true)
}

  const onCloseDetalles = () => {
    setListadecancionesSeleccionado(null)
    setShowDetalles(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])


  return (

    <>

      {showLoading ? (
        <Loading size={45} loading={1} />
      ) : (
        size(listadecanciones) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            <div className={styles.section}>
            {map(listadecanciones, (listadecancion) => (
              <div key={listadecancion.id} className={styles.box} onClick={() => onOpenDetalles(listadecancion)}>
                <div>
                  <div className={styles.column1}>
                    <BiMicrophone />
                  </div>
                  <div className={styles.column2}>
                    <div >
                      <h1>Canción</h1>
                      <h2>{getValueOrDefault(listadecancion?.cancion)}</h2>
                    </div>
                    <div >
                      <h1>Cantante</h1>
                      <h2>{getValueOrDefault(listadecancion?.cantante)}</h2>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )
      )}

      <BasicModal key={listadecancionesSeleccionado?.id}  title='agregar a la lista' show={showDetalles} onClose={onCloseDetalles}>
        <CancionesdisponiblesDetalles user={user} reload={reload} onReload={onReload} listadecancion={listadecancionesSeleccionado} onCloseDetalles={onCloseDetalles} onToastSuccess={onToastSuccess} onToastSuccessMod={onToastSuccessMod} onToastSuccessDel={onToastSuccessDel} />
      </BasicModal>

    </>

  )
}
