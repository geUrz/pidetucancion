import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import styles from './CheckoutForm.module.css';
import { Button, Message } from 'semantic-ui-react';

const CheckoutForm = ({ clientSecret, handleDonarYCrearCancion }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Asegúrate de que Stripe esté listo
    }

    setIsProcessing(true);

    handleDonarYCrearCancion()

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },

    });

    setIsProcessing(false);

    if (error) {
      setError(error.message);
    } else {
      if (paymentIntent.status === 'succeeded') {
        alert('¡Pago exitoso!');
      }
    }
  };

  return (

    <div className={styles.mainCheck}>
      <h1>Datos de tu tarjeta de débito/crédito</h1>
      
      <CardElement id="card" className={styles.StripeElement} />

      {error && <Message>{error}</Message>}

      <Button onClick={handleSubmit} primary disabled={isProcessing || !stripe}>
        {isProcessing ? 'Procesando...' : 'Donar'}
      </Button>
    </div>

  );
};

export default CheckoutForm;
