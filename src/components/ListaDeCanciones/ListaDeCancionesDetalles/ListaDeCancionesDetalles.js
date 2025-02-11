import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa'
import { IconClose, Confirm } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import { BasicModal } from '@/layouts'
import { ListaDeCancionesEditForm } from '../ListaDeCancionesEditForm'
import axios from 'axios'
import { getValueOrDefault } from '@/helpers'
import { CancionesenfilaForm } from '@/components/Cancionesenfila'
import styles from './ListaDeCancionesDetalles.module.css'
import { CancionDonar } from '@/components/CancionDonar'

export function ListaDeCancionesDetalles(props) {

  const { user, reload, onReload, listadecancion, onCloseDetalles, onCloseAndReOpenModal, onToastSuccess, onToastSuccessMod, onToastSuccessDel } = props

  const [showEdit, setShowEdit] = useState(false)

  const onOpenCloseEdit = () => setShowEdit((prevState) => !prevState)

  const [showDonar, setShowDonar] = useState(false)

  const onOpenCloseDonar = () => setShowDonar((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteCliente = async () => {
    if (listadecancion?.id) {
      try {
        await axios.delete(`/api/listadecanciones/listadecanciones?id=${listadecancion.id}`)
        onReload()
        onToastSuccessDel()
        onCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar la canción:', error)
      }
    } else {
      console.error('Canción o ID no disponible')
    }
  }

  const [cancionData, setCancionData] = useState(listadecancion)

  useEffect(() => {
    setCancionData(listadecancion) 
  }, [listadecancion]) 

  const actualizarCancion = (nuevaData) => {
    setCancionData((prevState) => ({
      ...prevState,
      ...nuevaData, 
    }))
  }
  
  return (

    <>

      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Canción</h1>
              <h2>{getValueOrDefault(cancionData?.cancion)}</h2>
            </div>
          </div>
            <div className={styles.box1_2}>
            <div>
              <h1>Cantante</h1>
              <h2>{getValueOrDefault(cancionData?.cantante)}</h2>
            </div>
          </div>
        </div>
        
        <CancionesenfilaForm cancionData={cancionData} reload={reload} onReload={onReload} onOpenCloseDonar={onOpenCloseDonar} onToastSuccess={onToastSuccess} onCloseDetalles={onCloseDetalles} />

      {user && user.nivel === 'admin' ?
        <>
          <div className={styles.iconEdit}>
          <div onClick={onOpenCloseEdit}>
            <FaEdit />
          </div>
        </div>
          <div className={styles.iconDel}>
            <div>
              <FaTrash onClick={onOpenCloseConfirmDel} />
            </div>
          </div>
        </> : null
        }

      </div>

      <BasicModal key={listadecancion?.id} title='modificar canción' show={showEdit} onClose={onOpenCloseEdit}>
        <ListaDeCancionesEditForm reload={reload} onReload={onReload} cancionData={cancionData} onOpenCloseEdit={onOpenCloseEdit} onCloseAndReOpenModal={onCloseAndReOpenModal} onToastSuccessMod={onToastSuccessMod} actualizarCancion={actualizarCancion} />
      </BasicModal>

      <BasicModal show={showDonar} onClose={onOpenCloseDonar}>
        <CancionDonar onOpenCloseDonar={onOpenCloseDonar} />
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
        onConfirm={handleDeleteCliente}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar la canción ?'
      />

    </>

  )
}
