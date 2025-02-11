import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Aquí puedes obtener el monto de la solicitud o configurarlo estáticamente
      const { amount } = req.body; // Monto en centavos

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'mxn', // Cambia esto a la moneda que desees
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
