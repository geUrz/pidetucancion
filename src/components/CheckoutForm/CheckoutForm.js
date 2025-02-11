import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import styles from './CheckoutForm.module.css'
import { Button } from 'semantic-ui-react';

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return; // Asegúrate de que Stripe esté listo
    }

    setIsProcessing(true)

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
  }

  return (

    <form onSubmit={handleSubmit}>
    <h3>Pago con tarjeta............................</h3>

    <div style={{ width: '100%', maxWidth: '400px' }}>
      <label htmlFor="card">Tarjeta de crédito</label>
      <CardElement id="card" className={styles.StripeElement} />
    </div>

    {error && <div className="error">{error}</div>}

    <Button type="submit" primary disabled={isProcessing || !stripe}>
      {isProcessing ? 'Procesando...' : 'Pagar'}
    </Button>
  </form>

  )
}

export default CheckoutForm;
