// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const stripe = require('stripe')(process.env.STRIPE_SK)
import { getCookie } from 'cookies-next';
import _getBreakdownPrice from './_getBreakdownPrice';


export default async function handler(req, res) {

    const { reservation, breakdown } = req.body;
    const { car } = reservation;

    const customer_id = getCookie('jlr_customer_id', { req, res })

    if (!customer_id) {
        return res.status(400).json({ 'error': 'no customer id found' })
    }

    // Create a PI
    const intent = await stripe.paymentIntents.create({
        customer: customer_id,
        description: `${car.name} Deposit`,
        amount: 500000,
        currency: 'GBP',
        payment_method_types: ['customer_balance', 'pay_by_bank'],
        payment_method_options: {
            customer_balance: {
                funding_type: 'bank_transfer',
                bank_transfer: {
                    type: 'gb_bank_transfer',
                },
            },
        },
        metadata: {
            CAR: car.code,
            ORDER_NO: 'JLR-123',
            breakdown: String(breakdown)
        }
    })


    res.status(200).json({ client_secret: intent.client_secret })
}
