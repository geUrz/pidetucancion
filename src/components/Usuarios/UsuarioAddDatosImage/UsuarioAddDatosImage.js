import { IconClose } from '@/components/Layouts'
import styles from './UsuarioAddDatosImage.module.css'

export function UsuarioAddDatosImage(props) {

  const {onCloseSubirImg} = props

  return (
    
    <>

      <IconClose onOpenClose={onCloseSubirImg} />

      <div className={styles.main}>
        <div className={styles.section}>
          <h1>Para poder subir una imagen, primero debes crear los datos del cantante / grupo.</h1>
        </div>
      </div>

    </>

  )
}
