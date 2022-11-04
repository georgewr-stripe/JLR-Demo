// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export const stripe = require('stripe')(process.env.STRIPE_SK)

export default async function handler(req, res) {

  const { email } = req.body;

  const verificationSession = await stripe.identity.verificationSessions.create({
    type: 'document',
    metadata: {
      email,
    },
  });

  res.status(200).json({ client_secret: verificationSession.client_secret })
}
