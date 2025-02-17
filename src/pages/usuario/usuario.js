import { BasicModal } from '@/layouts'
import { Confirm, Footer, Loading, Title, UploadImg } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import { FaCheck, FaEdit, FaFacebook, FaInstagram, FaTiktok, FaTimes, FaUser, FaVimeo, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { Button, Image } from 'semantic-ui-react'
import { useEffect, useState } from 'react'
import { ModCuentaForm, DatosUsuarioForm } from '@/components/Usuario'
import Link from 'next/link'
import { getValueOrDefault } from '@/helpers'
import { getValueOrWhite } from '@/helpers/getValueOrWhite'
import { useRouter } from 'next/router'
import axios from 'axios'
import styles from './usuario.module.css'
import { UsuarioAddDatosImage } from '@/components/Usuarios'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'

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
          // Primero, intentamos obtener los datos con el cantante_id
          let res = await axios.get(`/api/usuarios/datos_usuario?usuario_id=${user.cantante_id}`);

          // Si no encontramos la imagen, hacemos una nueva consulta usando user.id
          if (!res.data.image) {
            res = await axios.get(`/api/usuarios/datos_usuario?usuario_id=${user.id}`);
          }

          setDatoUsuario(res.data);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [user, reload])

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
  }, [datoUsuario, usuarioData])

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

  if (loading) {
    <Loading size={45} loading={1} />
  }

  const datoUser = user && usuarioData && usuarioData.id

  return (

    <ProtectedRoute>

      <Title title='datos del artista' iconBack />

      <div className={styles.main}>
        <div className={styles.section}>

          <div className={styles.image}>
            {!usuarioData?.image ? (
              <FaUser onClick={() => {
                if (user && user.nivel === 'admin') {
                  onShowSubirImg();
                }
              }} />
            ) : (
              <Image
                src={usuarioData.image}
                onClick={() => {
                  if (user && user.nivel === 'admin') {
                    setImageToDelete();
                    onShowConfirmDelImg();
                  }
                }}
              />
            )}

          </div>
          <div className={styles.nombre}>
            <h1>{getValueOrDefault(usuarioData?.nombre)}</h1>
            {user && user.nivel === 'admin' && (
              <div className={styles.iconEditUsuario} onClick={() => onShowOpenEditDatosUsuario('nombre')}>
                <FaEdit />
              </div>)
            }
            <h2>{getValueOrDefault(usuarioData?.artista)}</h2>
            {user && user.nivel === 'admin' && (
              <div className={styles.iconEditUsuario} onClick={() => onShowOpenEditDatosUsuario('artista')}>
                <FaEdit />
              </div>)
            }
          </div>

          <div className={styles.datos}>
            <div>
              <Link
                href={usuarioData?.whatsapp ? `https://wa.me/${getValueOrWhite(usuarioData.whatsapp)}` : "#"}
                target={usuarioData?.whatsapp ? "_blank" : "_self"}
                onClick={(e) => {
                  if (!usuarioData?.whatsapp) {
                    e.preventDefault();
                  }
                }}
              >
                <FaWhatsapp />
                <h2>{usuarioData?.whatsapp ? "Whatsapp" : getValueOrDefault(usuarioData?.whatsapp)}</h2>
              </Link>

              {user && user.nivel === 'admin' && (
                <div className={styles.iconEditForm} onClick={() => onShowOpenEditDatosUsuario('whatsapp')}>
                  <FaEdit />
                </div>
              )}
            </div>

            <div>
              <Link
                href={usuarioData?.facebook ? `${usuarioData.facebook}` : "#"}
                target={usuarioData?.facebook ? "_blank" : "_self"}
                onClick={(e) => {
                  if (!usuarioData?.facebook) {
                    e.preventDefault();
                  }
                }}
              >
                <FaFacebook />
                <h2>{usuarioData?.facebook ? "Facebook" : getValueOrDefault(usuarioData?.facebook)}</h2>
              </Link>

              {user && user.nivel === 'admin' && (
                <div className={styles.iconEditForm} onClick={() => onShowOpenEditDatosUsuario('facebook')}>
                  <FaEdit />
                </div>
              )}
            </div>

            <div>
              <Link
                href={usuarioData?.tiktok ? `${usuarioData.tiktok}` : "#"}
                target={usuarioData?.tiktok ? "_blank" : "_self"}
                onClick={(e) => {
                  if (!usuarioData?.tiktok) {
                    e.preventDefault();
                  }
                }}
              >
                <FaTiktok />
                <h2>{usuarioData?.tiktok ? "Tiktok" : getValueOrDefault(usuarioData?.tiktok)}</h2>
              </Link>

              {user && user.nivel === 'admin' && (
                <div className={styles.iconEditForm} onClick={() => onShowOpenEditDatosUsuario('tiktok')}>
                  <FaEdit />
                </div>
              )}
            </div>

            <div>
              <Link
                href={usuarioData?.instagram ? `${usuarioData.instagram}` : "#"}
                target={usuarioData?.instagram ? "_blank" : "_self"}
                onClick={(e) => {
                  if (!usuarioData?.instagram) {
                    e.preventDefault();
                  }
                }}
              >
                <FaInstagram />
                <h2>{usuarioData?.instagram ? "Instagram" : getValueOrDefault(usuarioData?.instagram)}</h2>
              </Link>

              {user && user.nivel === 'admin' && (
                <div className={styles.iconEditForm} onClick={() => onShowOpenEditDatosUsuario('instagram')}>
                  <FaEdit />
                </div>
              )}
            </div>

            <div>
              <Link
                href={usuarioData?.vimeo ? `${usuarioData.vimeo}` : "#"}
                target={usuarioData?.vimeo ? "_blank" : "_self"}
                onClick={(e) => {
                  if (!usuarioData?.vimeo) {
                    e.preventDefault();
                  }
                }}
              >
                <FaVimeo />
                <h2>{usuarioData?.vimeo ? "Vimeo" : getValueOrDefault(usuarioData?.vimeo)}</h2>
              </Link>

              {user && user.nivel === 'admin' && (
                <div className={styles.iconEditForm} onClick={() => onShowOpenEditDatosUsuario('vimeo')}>
                  <FaEdit />
                </div>
              )}
            </div>

            <div>
              <Link
                href={usuarioData?.youtube ? `${usuarioData.youtube}` : "#"}
                target={usuarioData?.youtube ? "_blank" : "_self"}
                onClick={(e) => {
                  if (!usuarioData?.youtube) {
                    e.preventDefault();
                  }
                }}
              >
                <FaYoutube />
                <h2>{usuarioData?.youtube ? "Youtube" : getValueOrDefault(usuarioData?.youtube)}</h2>
              </Link>

              {user && user.nivel === 'admin' && (
                <div className={styles.iconEditForm} onClick={() => onShowOpenEditDatosUsuario('youtube')}>
                  <FaEdit />
                </div>
              )}
            </div>

          </div>

          {user && (
            <>
              {user.nivel === 'admin' && (
                <div className={styles.iconEdit}>
                  <div onClick={onOpenClose}>
                    <FaEdit />
                  </div>
                </div>
              )}

              <Button negative onClick={logout}>
                Cerrar sesión
              </Button>
            </>
          )}

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

      <BasicModal title="Subir imagen" show={showSubirImg} onClose={onCloseSubirImg}>
        {usuarioData && datoUser ?
          <UploadImg
            reload={reload}
            onReload={onReload}
            itemId={usuarioData.id}
            endpoint="usuarios"
            onShowSubirImg={onCloseSubirImg}
            onSuccess={(key, url) => {
              setDatoUsuario({ ...datoUsuario, image: url })
              onCloseSubirImg()
            }}
            selectedImageKey="image"
          /> :
          <UsuarioAddDatosImage onCloseSubirImg={onCloseSubirImg} />
        }
      </BasicModal>


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

    </ProtectedRoute>

  )
}
