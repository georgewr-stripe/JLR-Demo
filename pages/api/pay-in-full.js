// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const stripe = require('stripe')(process.env.STRIPE_SK)
import { getCookie } from 'cookies-next';
import _getBreakdownPrice from './_getBreakdownPrice';


export default async function handler(req, res) {

    const { reservation, breakdown } = req.body;
    const { car, config } = reservation;

    const customer_id = getCookie('jlr_customer_id', { req, res })

    if (!customer_id) {
        return res.status(400).json({ 'error': 'no customer id found' })
    }

    // Create an Invoice
    let invoice = await stripe.invoices.create({
        customer: customer_id,
        collection_method: 'send_invoice',
        payment_settings: {
            payment_method_types: ['customer_balance'],
            payment_method_options: {
                customer_balance: {
                    funding_type: 'bank_transfer',
                    bank_transfer: {
                        type: 'gb_bank_transfer',
                    },
                },

            },
        },
        days_until_due: 0,
    });

    // Add the amount for the car
    await stripe.invoiceItems.create({
        customer: customer_id,
        description: `${car.name} Full Payment`,
        amount: (car.price * 100) - 9900,
        currency: 'GBP',
        invoice: invoice.id
    });
    if (config) {
        for (let conf of config) {
            await stripe.invoiceItems.create({
                customer: customer_id,
                description: conf.name,
                amount: conf.price * 100,
                currency: 'GBP',
                invoice: invoice.id
            });
        }
    }

    if (breakdown) {
        const breakdownPrice = await _getBreakdownPrice()

        const subscription = await stripe.subscriptions.create({
            customer: customer_id,
            description: 'Breakdown Cover',
            items: [{ price: breakdownPrice }],
            days_until_due: 0,
            collection_method: 'send_invoice',
            payment_settings: {
                payment_method_types: ['customer_balance'],
                payment_method_options: {
                    customer_balance: {
                        funding_type: 'bank_transfer',
                        bank_transfer: {
                            type: 'gb_bank_transfer',
                        },
                    },
                },
            },
        });
    }

    invoice = await stripe.invoices.finalizeInvoice(invoice.id);

    const intent = await stripe.paymentIntents.retrieve(invoice.payment_intent)

    // await stripe.paymentIntents.update(intent.id, {
    //     payment_method_options: {
    //         card: {
    //             setup_future_usage: 'off_session'
    //         }
    //     }
    // })

    res.status(200).json({ client_secret: intent.client_secret })
}
