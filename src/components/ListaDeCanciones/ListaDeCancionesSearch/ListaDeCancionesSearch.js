import { map, size } from 'lodash'
import { ListEmpty, Loading } from '@/components/Layouts'
import { BasicModal } from '@/layouts'
import { useState } from 'react'
import styles from './ListaDeCancionesSearch.module.css'
import { ListaDeCancionesDetalles } from '../ListaDeCancionesDetalles'
import { BiMicrophone } from 'react-icons/bi'
import { getValueOrDefault } from '@/helpers'

export function ListaDeCancionesSearch(props) {

  const { user, reload, onReload, listadecanciones, onToastSuccessMod } = props

  const [showDetalles, setShowDetalles] = useState(false)
  const [listadecancionSeleccionada, setListadecancionSeleccionada] = useState(null)

  const onOpenDetalles = (usuario) => {
    setListadecancionSeleccionada(usuario)
    setShowDetalles(true) 
  }

  const onCloseDetalles = () => {
    setListadecancionSeleccionada(null)
    setShowDetalles(false)
  }

  return (

    <>

      {!listadecanciones ? (
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

      <BasicModal title='detalles de la canción' show={showDetalles} onClose={onCloseDetalles}>
        {listadecancionSeleccionada && (
          <ListaDeCancionesDetalles
            user={user}
            reload={reload}
            onReload={onReload}
            listadecancion={listadecancionSeleccionada}
            onCloseDetalles={onCloseDetalles}
            onToastSuccessMod={onToastSuccessMod}
          />
        )}
      </BasicModal>

    </>

  )
}
