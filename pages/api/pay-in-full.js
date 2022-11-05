// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const stripe = require('stripe')(process.env.STRIPE_SK)
import { getCookie } from 'cookies-next';

export default async function handler(req, res) {

    const { reservation } = req.body;
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
            payment_method_types: ['customer_balance', 'card'], payment_method_options: {
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

    // if (breakdown) {
    //     await stripe.invoiceItems.create({
    //         customer: customer_id,
    //         description: 'Breakdown Cover',
    //         price: 'price_1M0n2gG0XQZfty504Iz4bSpt',
    //         invoice: invoice.id
    //     });
    // }

    invoice = await stripe.invoices.finalizeInvoice(invoice.id);

    const intent = await stripe.paymentIntents.retrieve(invoice.payment_intent)

    res.status(200).json({ client_secret: intent.client_secret })
}
