import { BasicLayout, BasicModal } from '@/layouts'
import { Add, Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { CancionesdisponiblesForm, CancionesdisponiblesLista, CancionesdisponiblesSearch, SearchCancionesdisponibles } from '@/components/Cancionesdisponibles'
import { FaSearch } from 'react-icons/fa'
import styles from './cancionesdisponibles.module.css'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'

export default function Cancionesdisponibles() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openCloseForm, setOpenCloseForm] = useState(false)

  const onOpenCloseForm = () => setOpenCloseForm((prevState) => !prevState)

  const [search, setSearch] = useState(false)

  const onOpenCloseSearch = () => setSearch((prevState) => !prevState)

  const [resultados, setResultados] = useState([])

  const [listadecanciones, setListadecanciones] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/listadecanciones/listadecanciones`)
        setListadecanciones(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  const [toastSuccess, setToastSuccessReportes] = useState(false)
  const [toastSuccessMod, setToastSuccessReportesMod] = useState(false)
  const [toastSuccessDel, setToastSuccessReportesDel] = useState(false)

  const onToastSuccess = () => {
    setToastSuccessReportes(true)
    setTimeout(() => {
      setToastSuccessReportes(false)
    }, 3000)
  }

  const onToastSuccessMod = () => {
    setToastSuccessReportesMod(true)
    setTimeout(() => {
      setToastSuccessReportesMod(false)
    }, 3000)
  }

  const onToastSuccessDel = () => {
    setToastSuccessReportesDel(true)
    setTimeout(() => {
      setToastSuccessReportesDel(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Agregado exitosamente' onClose={() => setToastSuccessReportes(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessReportesMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminado exitosamente' onClose={() => setToastSuccessReportesDel(false)} />}

        <Title title='canciones disponibles' />

        {!search ? (
          ''
        ) : (
          <div className={styles.searchMain}>
            <SearchCancionesdisponibles user={user} onResults={setResultados} reload={reload} onReload={onReload} onToastSuccessMod={onToastSuccessMod} onOpenCloseSearch={onOpenCloseSearch} />
            {resultados.length > 0 && (
              <CancionesdisponiblesSearch visitas={resultados} reload={reload} onReload={onReload} />
            )}
          </div>
        )}

        {!search ? (
          <div className={styles.iconSearchMain}>
            <div className={styles.iconSearch} onClick={onOpenCloseSearch}>
              <h1>Busca tu canción</h1>
              <FaSearch />
            </div>
          </div>
        ) : (
          ''
        )}

        {user && user.nivel === 'admin' ?
          <Add onOpenClose={onOpenCloseForm} /> : null
        }

        <CancionesdisponiblesLista user={user} loading={loading} reload={reload} onReload={onReload} listadecanciones={listadecanciones} setListadecanciones={setListadecanciones} onToastSuccessMod={onToastSuccessMod} onToastSuccess={onToastSuccess} onToastSuccessDel={onToastSuccessDel} />

        <BasicModal title='crear canción' show={openCloseForm} onClose={onOpenCloseForm}>
          <CancionesdisponiblesForm reload={reload} onReload={onReload} onToastSuccess={onToastSuccess} onCloseForm={onOpenCloseForm} />
        </BasicModal>

      </BasicLayout>


    </ProtectedRoute>


  )
}
