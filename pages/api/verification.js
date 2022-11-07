// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const stripe = require('stripe')(process.env.STRIPE_SK)

export default async function handler(req, res) {

  const { email, name } = req.body;

  const customer = await stripe.customers.create({ email, name })

  const verificationSession = await stripe.identity.verificationSessions.create({
    type: 'document',

    metadata: {
      email,
      customer_id: customer.id
    },
  });

  res.status(200).json({ client_secret: verificationSession.client_secret, customer_id: customer.id })
}
