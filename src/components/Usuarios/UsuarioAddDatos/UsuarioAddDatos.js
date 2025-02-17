import { IconClose } from '@/components/Layouts'
import styles from './UsuarioAddDatos.module.css'
import Link from 'next/link'

export function UsuarioAddDatos(props) {

  const { onOpenCloseForm } = props

  return (

    <>

      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.main}>
        <div className={styles.section}>
          <h1>Para crear un usuario, primero debes crear los datos del cantante / grupo.</h1>
          <Link href='/usuario'>
            Haz clic aquí
          </Link>
        </div>
      </div>

    </>

  )
}
