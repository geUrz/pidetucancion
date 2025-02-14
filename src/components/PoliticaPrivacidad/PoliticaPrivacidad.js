import { IconClose } from '../Layouts'
import styles from './PoliticaPrivacidad.module.css'

export function PoliticaPrivacidad(props) {

  const {onOpenClosePolitica} = props

  return (
    
    <>
    
      <IconClose onOpenClose={onOpenClosePolitica} />

      <div className={styles.main}>
        <div className={styles.section}>
          <h1>Política de Privacidad sobre Datos Bancarios</h1>
          <h3>En [Nombre de tu empresa o plataforma], la seguridad y privacidad de nuestros usuarios son nuestra máxima prioridad. Nos comprometemos a proteger su información y garantizar que los datos de su tarjeta bancaria se manejen de manera segura.</h3>
          <h2>1. No almacenamos datos de tarjetas bancarias</h2>
          <h3>En ningún momento almacenamos, guardamos o retenemos la información de su tarjeta de crédito o débito en nuestros servidores. Toda la información de pago se procesa a través de proveedores de pago seguros y certificados.</h3>
          <h2>2. Uso de pasarelas de pago seguras</h2>
          <h3>Para procesar transacciones, utilizamos plataformas de pago de terceros que cumplen con los estándares de seguridad más altos, como PCI DSS (Payment Card Industry Data Security Standard). Esto garantiza que sus datos están protegidos mediante cifrado y otras medidas de seguridad avanzadas.</h3>
          <h2>3. Cifrado y transmisión segura</h2>
          <h3>Toda la información ingresada en nuestra plataforma se transmite mediante conexiones seguras y cifradas con tecnología SSL (Secure Socket Layer), lo que protege sus datos contra accesos no autorizados.</h3>
          <h2>4. Autorización del pago</h2>
          <h3>Cuando ingresa los datos de su tarjeta, estos se envían directamente a la pasarela de pago para su procesamiento. Nosotros solo recibimos la confirmación del pago y nunca tenemos acceso a los datos completos de su tarjeta.</h3>
          <h2>5. Protección contra fraudes</h2>
          <h3>Colaboramos con nuestros proveedores de pago para detectar y prevenir fraudes en las transacciones. Si identificamos alguna actividad sospechosa, tomaremos las medidas necesarias para proteger su cuenta.</h3>
          <h2>6. Sus derechos y contacto</h2>
          <h3>Si tiene preguntas sobre la seguridad de sus datos bancarios o desea más información sobre nuestras prácticas de privacidad, puede contactarnos en [correo de soporte].</h3>
        </div>
      </div>

    </>

  )
}
