import Link from 'next/link'
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { Image } from 'semantic-ui-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import styles from './Menu.module.css'

export function Menu() {

  const { user } = useAuth()

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

  return (

    <>

      <div className={styles.mainTop}>
        <Link href='/'>
          <h1>Pide tu canción</h1>
        </Link>
        <div className={styles.iconUser}>
          <Link href='/usuario/usuario'>
            {datoUsuario && datoUsuario.image ? (
              <Image src={datoUsuario.image} alt="User Image" />
            ) : (
              <FaUser />
            )}
          </Link>

        </div>
      </div>

    </>

  )
}
