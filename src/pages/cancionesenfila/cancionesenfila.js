import { BasicLayout } from '@/layouts'
import { Loading, Title, ToastDelete } from '@/components/Layouts'
import { CancionesenfilaLista } from '@/components/Cancionesenfila'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './cancionesenfila.module.css'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'

export default function Cancionesenfila() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const [cancionesenfila, setCancionesenfila] = useState([])

  const onReload = (deletedSongId) => {
    setCancionesenfila(prevCanciones => prevCanciones.filter(cancion => cancion.id !== deletedSongId))
    setReload(true)
  }

  useEffect(() => {
    if (reload) {
      (async () => {
        try {
          const res = await axios.get(`/api/cancionesenfila/cancionesenfila`)
          setCancionesenfila(res.data)
          setReload(false)
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [reload])

  const [toastSuccessDel, setToastSuccessReportesDel] = useState(false)

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

      <BasicLayout relative>

        {toastSuccessDel && <ToastDelete contain='Eliminado exitosamente' onClose={() => setToastSuccessReportesDel(false)} />}

        <Title title='canciones en fila' />

        <CancionesenfilaLista user={user} loading={loading} reload={reload} onReload={onReload} cancionesenfila={cancionesenfila} setCancionesenfila={setCancionesenfila} onToastSuccessDel={onToastSuccessDel} />

      </BasicLayout>

    </ProtectedRoute>

  )
}
