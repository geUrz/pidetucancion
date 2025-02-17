import { Add, Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { UsuarioAddDatos, UsuarioForm, UsuariosLista } from '@/components/Usuarios'
import { useAuth } from '@/contexts/AuthContext'
import { BasicLayout, BasicModal } from '@/layouts'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Usuarios() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openCloseForm, setOpenCloseForm] = useState(false)

  const onOpenCloseForm = () => setOpenCloseForm((prevState) => !prevState)

  const [usuarios, setUsuarios] = useState(null)

  useEffect(() => {
    if (user && user.id) {
      (async () => {
        try {
          const res = await axios.get(`/api/usuarios/usuarios?cantante_id=${user.id}`)
          setUsuarios(res.data)
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [reload, user])

  const [datosUsuario, setDatosUsuario] = useState(null)

  useEffect(() => {
    if (user && user.id) {
      (async () => {
        try {
          const res = await axios.get(`/api/usuarios/datos_usuario?usuario_id=${user.id}`)
          setDatosUsuario(res.data)
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [reload, user])

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

  const datoUsuario = datosUsuario && user.id === datosUsuario.usuario_id

  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccessReportes(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessReportesMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminado exitosamente' onClose={() => setToastSuccessReportesDel(false)} />}

        <Title title='usuarios' />

        <Add user={user} onOpenClose={onOpenCloseForm} />

        <UsuariosLista user={user} loading={loading} reload={reload} onReload={onReload} usuarios={usuarios} setUsuarios={setUsuarios} onToastSuccessMod={onToastSuccessMod} onToastSuccess={onToastSuccess} onToastSuccessDel={onToastSuccessDel} />

      </BasicLayout>

      <BasicModal title={datoUsuario ? 'crear usuario' : 'datos de cantante'} show={openCloseForm} onClose={onOpenCloseForm}>
        {datoUsuario ?
          <UsuarioForm user={user} reload={reload} onReload={onReload} onToastSuccess={onToastSuccess} onOpenCloseForm={onOpenCloseForm} /> :
          <UsuarioAddDatos onOpenCloseForm={onOpenCloseForm} />
        }
      </BasicModal>

    </ProtectedRoute>

  )
}
