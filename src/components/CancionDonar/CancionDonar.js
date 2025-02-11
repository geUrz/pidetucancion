import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { IconClose } from '../Layouts'
import CheckoutForm from '../CheckoutForm/CheckoutForm'
import { useEffect, useState } from 'react'
import styles from './CancionDonar.module.css'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);


export function CancionDonar(props) {

  const {onOpenCloseDonar} = props

  const [clientSecret, setClientSecret] = useState('');
  
  useEffect(() => {
    const createPaymentIntent = async () => {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        body: JSON.stringify({ amount: 5000 }), // Monto en centavos (50.00 USD)
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setClientSecret(data.clientSecret);
    };

    createPaymentIntent();
  }, []);

  return (
    
    <>

      <IconClose onOpenClose={onOpenCloseDonar} />

      <div className={styles.main}>
      <h1>DONAR</h1>

      <h1>Pago</h1>
      {clientSecret && (
        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
      </div>

    </>

  )
}
