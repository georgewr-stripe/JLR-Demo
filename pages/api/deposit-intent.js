// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const stripe = require('stripe')(process.env.STRIPE_SK)
import { getCookie } from 'cookies-next';

export default async function handler(req, res) {

    const { total, car, config } = req.body;

    const customer_id = getCookie('jlr_customer_id', { req, res })

    if (!customer_id) {
        return res.status(400).json({ 'error': 'no customer id found' })
    }

    const intent = await stripe.paymentIntents.create({
        customer: customer_id,
        amount: total / 10,
        currency: 'GBP',
        payment_method_types: ['card', 'bacs_debit', 'customer_balance'],
        description: car.name + ' Deposit',
        setup_future_usage: 'off_session',
        metadata: {
            type: 'deposit',
            car: car.code,
            config: JSON.stringify(config.map(c => c.code)),
            total: JSON.stringify(total * 100)
        }
    })


    res.status(200).json({ client_secret: intent.client_secret })
}