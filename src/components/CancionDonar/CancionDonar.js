import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import { useEffect, useState } from 'react';
import styles from './CancionDonar.module.css';
import { Image, Message } from 'semantic-ui-react';
import { IconClose } from '../Layouts';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export function CancionDonar(props) {

  const { cancionData, onOpenCloseDonar, onCloseDetalles } = props;

  const [clientSecret, setClientSecret] = useState('');
  const [amount, setAmount] = useState(''); // Manejamos el monto como string
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAmountChange = (e) => {
    let value = e.target.value;

    // Si el campo está vacío, simplemente establecemos el valor como vacío
    if (value === '') {
      setAmount('');
      setError('');
      return;
    }

    // Validar si el valor contiene solo números (y punto decimal para valores flotantes)
    const validAmount = /^[0-9]*\.?[0-9]*$/.test(value.replace('$', ''));

    // Si el valor no es válido, no actualizar el estado
    if (!validAmount) {
      return;
    }

    // Si el valor contiene solo números y no tiene el signo $, lo agregamos automáticamente
    if (value !== '' && !value.startsWith('$')) {
      value = '$' + value;
    }

    // Validamos si el monto no es menor a 10
    if (value !== '' && parseFloat(value.replace('$', '').trim()) < 10) {
      setError('El monto mínimo es de $10.00 MXN');
    } else {
      setError('');
    }

    setAmount(value); // Actualizamos el valor del monto
  };

  // Función para crear el PaymentIntent cuando el monto cambie
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (amount === '' || parseFloat(amount.replace('$', '').trim()) < 10) {
        return; // No hacer nada si el monto es inválido
      }

      setIsSubmitting(true);
      setError(''); // Limpiamos el error si el monto es válido

      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          body: JSON.stringify({ amount: parseFloat(amount.replace('$', '').trim()) * 100 }), // Convertimos a centavos
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al crear el PaymentIntent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret); // Establecemos el clientSecret para pasarlo al CheckoutForm
      } catch (error) {
        console.error(error);
        setError('Hubo un problema al procesar tu pago');
      } finally {
        setIsSubmitting(false);
      }
    };

    // Solo intentamos crear el PaymentIntent si el monto es válido
    if (amount !== '' && parseFloat(amount.replace('$', '').trim()) >= 10) {
      createPaymentIntent();
    }
  }, [amount]);

  // Función para crear la canción en el backend después de la donación
  const crearCancion = async () => {
    try {
      const response = await axios.post('/api/cancionesenfila/cancionesenfila', {
        cancion: cancionData.cancion,
        cantante: cancionData.cantante,
        // otros campos que quieras enviar para la canción
      });

      onOpenCloseDonar()
      onCloseDetalles()
    } catch (error) {
      console.error('Error al crear la canción:', error);
    }
  };

  const handleDonarYCrearCancion = async () => {
    if (amount && parseFloat(amount.replace('$', '').trim()) >= 10) {
      // Realizamos la donación primero (lógica de Stripe)
      // Luego creamos la canción
      await crearCancion();
    } else {
      console.error('Monto no válido para la donación');
    }
  };

  return (
    <>
      <IconClose onOpenClose={onOpenCloseDonar} />

      <div className={styles.main}>
        <h1>¿ Deseas hacer una donación ?</h1>
        <div className={styles.pagoSeguro}>
          <h1>Pago seguro</h1>
          <Image src='/img/pagoseguro.png' />
        </div>
        <h2>¡ Ingresa una cantidad aquí !</h2>

        <div className={styles.amount}>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="$0.00"
            style={{
              backgroundColor: 'transparent',
              color: 'azure',
              border: 'none',
              fontSize: '40px',
              fontWeight: 'bold',
              textAlign: 'center',
              width: '100%',
              outline: 'none',
            }}
          />
        </div>

        {error && <Message>{error}</Message>}

        {clientSecret && (
          <Elements stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} handleDonarYCrearCancion={handleDonarYCrearCancion} />
          </Elements>
        )}

        <h3 onClick={crearCancion}>No deseo donar, solo agregar la canción</h3>
      </div>
    </>
  );
}
