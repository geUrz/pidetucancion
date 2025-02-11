import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Obtener monto desde el cuerpo de la solicitud
      const { amount } = req.body; // Monto en centavos

      // Verificar que el monto es válido
      if (typeof amount !== 'number' || amount <= 0) {
        throw new Error('Monto inválido');
      }

      // Crear el PaymentIntent en Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'mxn',
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error al crear el PaymentIntent:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
