// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const stripe = require('stripe')(process.env.STRIPE_SK)
import { getCookie } from 'cookies-next';

export default async function handler(req, res) {


    const customer_id = getCookie('jlr_customer_id', { req, res })

    if (!customer_id) {
        return res.status(400).json({ 'error': 'no customer id found' })
    }

    const setupIntent = await stripe.setupIntents.create({
        customer: customer_id,
        payment_method_types: ['card', 'bacs_debit', 'customer_balance'],
        usage: 'off_session'
    })

    res.status(200).json({ client_secret: setupIntent.client_secret })
}
