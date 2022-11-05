// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const stripe = require('stripe')(process.env.STRIPE_SK)
import { getCookie } from 'cookies-next';


const breakdownPrice = 'price_1M0sKFG0XQZfty507ko1LdDl'

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
            payment_method_types: ['customer_balance', 'card', 'bacs_debit'],
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
        description: `${car.name} Deposit`,
        amount: 500000,
        currency: 'GBP',
        invoice: invoice.id
    });

    const ppcProduct = await stripe.products.create({
        name: `${car.name} PPC Repayment`,
        metadata: {
            customer_id: customer_id,
            'JLR-PPC-ID': '12345'
        }
    })


    const monthly_amount = Math.ceil((reservation.total - 9900 - 5000000) / 24);
    // Starting a subscription 30 days from now
    const schedule = await stripe.subscriptionSchedules.create({
        customer: customer_id,
        start_date: Math.floor(new Date(new Date().setDate(new Date().getDate() + 30)).getTime() / 1000),
        end_behavior: 'release',
        phases: [
            {
                items: [{
                    price_data: {
                        currency: 'GBP',
                        product: ppcProduct.id,
                        unit_amount: monthly_amount,
                        recurring: {
                            interval: 'month'
                        }
                    },
                    quantity: 1
                }],
                iterations: 24,
                collection_method: 'send_invoice',
                invoice_settings: {
                    days_until_due: 30
                }

            }
        ],
        // payment_settings: {
        //     payment_method_types: ['customer_balance', 'card', 'bacs_debit'],
        //     payment_method_options: {
        //         customer_balance: {
        //             funding_type: 'bank_transfer',
        //             bank_transfer: {
        //                 type: 'gb_bank_transfer',
        //             },
        //         },
        //     },
        // },
    });



    if (breakdown) {
        await stripe.subscriptions.create({
            customer: customer_id,
            description: 'Breakdown Cover',
            items: [{ price: breakdownPrice }],
            days_until_due: 0,
            collection_method: 'send_invoice',
            payment_settings: {
                payment_method_types: ['customer_balance', 'card', 'bacs_debit'],
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

    await stripe.paymentIntents.update(intent.id, {
        payment_method_options: {
            card: {
                setup_future_usage: 'off_session'
            },
            bacs_debit: {
                setup_future_usage: 'off_session'

            }
        }
    })

    res.status(200).json({ client_secret: intent.client_secret })
}
