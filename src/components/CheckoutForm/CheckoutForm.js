import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import styles from './CheckoutForm.module.css';
import { Button, Image, Message } from 'semantic-ui-react';
import Link from 'next/link';
import { BasicModal } from '@/layouts';
import { PoliticaPrivacidad } from '../PoliticaPrivacidad';

const CheckoutForm = ({ clientSecret, handleDonarYCrearCancion }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const [showPolitica, setShowPolitica] = useState(false)

  const onOpenClosePolitica = () => setShowPolitica((prevState) => !prevState)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return; // Asegúrate de que Stripe esté listo
    }

    setIsProcessing(true)

    handleDonarYCrearCancion()

    const cardElement = elements.getElement(CardElement)

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },

    })

    setIsProcessing(false)

    if (error) {
      setError(error.message)
    } else {
      if (paymentIntent.status === 'succeeded') {
        alert('¡Pago exitoso!')
      }
    }
  };

  return (

    <div className={styles.mainCheck}>
      <h1>Datos de tu tarjeta de débito/crédito</h1>
      
      <CardElement id="card" className={styles.StripeElement} />

      {error && <Message>{error}</Message>}

      <Image src='img/tarjetas.png' />
      
      <h2>No almacenamos los datos de tu tarjeta. Consulta nuestra <span onClick={onOpenClosePolitica}>Política de privacidad.</span></h2>

      <div className={styles.pagoSeguro}>
        <Image src='/img/datosseguros.png' />
      </div>

      <Button onClick={handleSubmit} primary disabled={isProcessing || !stripe}>
        {isProcessing ? 'Procesando...' : 'Donar y agregar canción'}
      </Button>

      <BasicModal show={showPolitica} onClose={onOpenClosePolitica}>
        <PoliticaPrivacidad onOpenClosePolitica={onOpenClosePolitica} />
      </BasicModal>

    </div>

  )
};

export default CheckoutForm;
