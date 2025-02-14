import { BasicModal } from '@/layouts'
import { Confirm, Footer, Loading, Title, UploadImg } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import { FaCheck, FaEdit, FaFacebook, FaInstagram, FaTiktok, FaTimes, FaUser, FaVimeo, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { Button, Image } from 'semantic-ui-react'
import { useEffect, useRef, useState } from 'react'
import { ModCuentaForm, DatosUsuarioForm } from '@/components/Usuario'
import Link from 'next/link'
import { getValueOrDefault } from '@/helpers'
import { getValueOrWhite } from '@/helpers/getValueOrWhite'
import { useRouter } from 'next/router'
import axios from 'axios'
import styles from './usuario.module.css'

export default function Usuario() {

  const { user, logout, loading } = useAuth()

  const router = useRouter()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenClose = () => setShow((prevState) => !prevState)

  const handleLoginRedirect = () => {
    router.push('/join/signin')
  }

  const [datoUsuario, setDatoUsuario] = useState(null)

  useEffect(() => {
    if (user && user.id) {
      (async () => {
        try {
          const res = await axios.get(`/api/usuarios/datos_usuario?usuario_id=${user.id}`)
          setDatoUsuario(res.data)
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [user])

  const [showSubirImg, setShowSubirImg] = useState(false)

  const onShowSubirImg = () => {
    setShowSubirImg(true)
  }

  const onCloseSubirImg = () => {
    setShowSubirImg(false)
  }

  const [showConfirmDelImg, setShowConfirmDelImg] = useState(false)
  const onShowConfirmDelImg = () => setShowConfirmDelImg(true)

  const [imgKeyToDelete, setImgKeyToDelete] = useState(null)

  const setImageToDelete = () => {
    if (datoUsuario?.image) {
      setImgKeyToDelete('image')
    }
  }

  const handleDeleteImage = async () => {
    try {
      await axios.delete(`/api/usuarios/uploadImage`, {
        params: {
          id: datoUsuario.id,
          imageKey: imgKeyToDelete,
        },
      })

      setDatoUsuario((prevDatoPDF) => ({
        ...prevDatoPDF,
        [imgKeyToDelete]: null,
      }))

      onReload()
      //setShowImg(false)
      setShowConfirmDelImg(false)
    } catch (error) {
      console.error('Error al eliminar la imagen:', error)
    }
  }

  const [showEditDatosUsuario, setShowEditDatosUsuario] = useState(false)
  const [fieldToEdit, setFieldToEdit] = useState(null);

  const onShowOpenEditDatosUsuario = (field) => {
    setShowEditDatosUsuario(true);
    setFieldToEdit(field)
  }

  const onShowCloseEditDatosUsuario = () => {
    setShowEditDatosUsuario(false);
    setFieldToEdit(null)
  }

  const [usuarioData, setUsuarioData] = useState(datoUsuario)

  useEffect(() => {
    setUsuarioData(datoUsuario)
  }, [datoUsuario])

  const actualizarCancion = (nuevaData) => {
    setUsuarioData((prevState) => ({
      ...prevState,
      ...nuevaData,
    }))
  }

  const [keyCode, setKeyCode] = useState(false)

  const handleKeyCode = (event) => {
    if (event.ctrlKey && event.key === 'l') {
      setKeyCode((prevState) => !prevState)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyCode)

    return () => {
      window.removeEventListener('keydown', handleKeyCode)
    }
  }, [])

  const gestureAreaRef = useRef(null)

  const handleTouchStart = (e) => {
    e.currentTarget.touchStartTime = e.timeStamp
  };

  const handleTouchEnd = (e) => {
    const touchDuration = e.timeStamp - e.currentTarget.touchStartTime
    if (touchDuration > 3000) {
      setKeyCode((prevState) => !prevState)
      console.log('Toque prolongado detectado')
    }
  };

  useEffect(() => {
    const element = gestureAreaRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart)
      element.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      if (element) {
        element.removeEventListener('touchstart', handleTouchStart)
        element.removeEventListener('touchend', handleTouchEnd)
      }
    };
  }, [])

  if (loading) {
    <Loading size={45} loading={1} />
  }

  return (

    <>

      <Title title='datos del artista' iconBack />

      <div className={styles.main}>
        <div className={styles.section}>

          <div className={styles.image} ref={gestureAreaRef}>
            {!usuarioData?.image ? (
              <FaUser onClick={() => onShowSubirImg()} />
            ) : (
              <Image
                src={usuarioData.image}
                onClick={() => {
                  setImageToDelete()
                  onShowConfirmDelImg()
                }}
              />
            )}
          </div>

          <div className={styles.nombre}>
            <h1>{getValueOrDefault(usuarioData?.nombre)}</h1>
            {user && user ?
              <div className={styles.iconEditUsuario} onClick={() => onShowOpenEditDatosUsuario('nombre')}>
                <FaEdit />
              </div> : null
            }
            <h2>{getValueOrDefault(usuarioData?.artista)}</h2>
            {user && user ?
              <div className={styles.iconEditUsuario} onClick={() => onShowOpenEditDatosUsuario('artista')}>
                <FaEdit />
              </div> : null
            }
          </div>

          <div className={styles.datos}>
            <div>
              <Link href={`https://wa.me/${getValueOrWhite(usuarioData?.whatsapp)}`} target="_blank">
                <FaWhatsapp />
                <h2>Whatsapp</h2>
              </Link>
              {user && user ?
                <div className={styles.iconEditForm} onClick={() => onShowOpenEditDatosUsuario('whatsapp')}>
                  <FaEdit />
                </div> : null
              }
            </div>
            <div>
              <Link href={`${usuarioData?.facebook}`} target="_blank">
                <FaFacebook />
                <h2>Facebook</h2>
              </Link>
              {user && user ?
                <div className={styles.iconEditForm} onClick={() => onShowOpenEditDatosUsuario('facebook')}>
                  <FaEdit />
                </div> : null
              }
            </div>
            <div>
              <Link href={`${usuarioData?.tiktok}`} target="_blank">
                <FaTiktok />
                <h2>Tiktok</h2>
              </Link>
              {user && user ?
                <div className={styles.iconEditForm} onClick={() => onShowOpenEditDatosUsuario('tiktok')}>
                  <FaEdit />
                </div> : null
              }
            </div>
            <div>
              <Link href={`${usuarioData?.instagram}`} target="_blank">
                <FaInstagram />
                <h2>Instagram</h2>
              </Link>
              {user && user ?
                <div className={styles.iconEditForm} onClick={() => onShowOpenEditDatosUsuario('instagram')}>
                  <FaEdit />
                </div> : null
              }
            </div>
            <div>
              <Link href={`${usuarioData?.vimeo}`} target="_blank">
                <FaVimeo />
                <h2>Vimeo</h2>
              </Link>
              {user && user ?
                <div className={styles.iconEditForm} onClick={() => onShowOpenEditDatosUsuario('vimeo')}>
                  <FaEdit />
                </div> : null
              }
            </div>
            <div>
              <Link href={`${usuarioData?.youtube}`} target="_blank">
                <FaYoutube />
                <h2>Youtube</h2>
              </Link>
              {user && user ?
                <div className={styles.iconEditForm} onClick={() => onShowOpenEditDatosUsuario('youtube')}>
                  <FaEdit />
                </div> : null
              }
            </div>
          </div>

          {user && user.nombre ?
            <>
              <div className={styles.iconEdit}>
                <div onClick={onOpenClose}>
                  <FaEdit />
                </div>
              </div>
              <Button
                negative
                onClick={logout}
              >
                Cerrar sesión
              </Button>
            </> : null
          }

          {keyCode ?
            <Button
              primary
              onClick={handleLoginRedirect}
            >
              Iniciar sesión
            </Button> : null
          }

        </div>

        <Footer />

      </div>

      <BasicModal title='modificar usuario' show={show} onClose={onOpenClose}>
        <ModCuentaForm onOpenClose={onOpenClose} />
      </BasicModal>

      {user && user.nombre ?
        <BasicModal title="Subir imagen" show={showSubirImg} onClose={onCloseSubirImg}>
        {datoUsuario &&
          <UploadImg
            reload={reload}
            onReload={onReload}
            itemId={datoUsuario.id}
            endpoint="usuarios"
            onShowSubirImg={onCloseSubirImg}
            onSuccess={(key, url) => {
              setDatoUsuario({ ...datoUsuario, image: url })
              onCloseSubirImg()
            }}
            selectedImageKey="image"
          />
        }
      </BasicModal>: null
      }

      <BasicModal key={datoUsuario?.id} show={showEditDatosUsuario} onClose={onShowCloseEditDatosUsuario}>
        <DatosUsuarioForm user={user} reload={reload} onReload={onReload} usuarioData={usuarioData} actualizarCancion={actualizarCancion} fieldToEdit={fieldToEdit} onShowCloseEditDatosUsuario={onShowCloseEditDatosUsuario} />
      </BasicModal>

      <Confirm
        open={showConfirmDelImg}
        cancelButton={<div className={styles.iconClose}><FaTimes /></div>}
        confirmButton={<div className={styles.iconCheck}><FaCheck /></div>}
        onConfirm={handleDeleteImage}
        onCancel={() => setShowConfirmDelImg(false)}
        content="¿Estás seguro de eliminar la imagen?"
      />

    </>

  )
}
