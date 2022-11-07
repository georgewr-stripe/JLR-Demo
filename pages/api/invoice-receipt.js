// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const stripe = require('stripe')(process.env.STRIPE_SK)
import { getCookie } from 'cookies-next';

export default async function handler(req, res) {

    const { payment_intent } = req.body;

    const customer_id = getCookie('jlr_customer_id', { req, res })

    if (!customer_id) {
        return res.status(400).json({ 'error': 'no customer id found' })
    }

    const intent = await stripe.paymentIntents.retrieve(payment_intent, { expand: ['invoice'] });

    res.status(200).json({ url: intent.invoice?.invoice_pdf })
}
