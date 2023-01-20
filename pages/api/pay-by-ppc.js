// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const stripe = require('stripe')(process.env.STRIPE_SK)
import { getCookie } from 'cookies-next';
import _getBreakdownPrice from './_getBreakdownPrice';
import _getPPCProduct from './_getPPCProduct';


export default async function handler(req, res) {

    const { reservation, breakdown } = req.body;
    const { car, config } = reservation;

    const customer_id = getCookie('jlr_customer_id', { req, res })

    if (!customer_id) {
        return res.status(400).json({ 'error': 'no customer id found' })
    }

    const monthly_amount = Math.ceil((reservation.total - 9900 - 500000) / 24);


    const ppcProduct = await _getPPCProduct()

    const PPCprice = await stripe.prices.create({
        currency: 'GBP',
        product: ppcProduct,
        unit_amount: monthly_amount,
        recurring: {
            interval: 'month'
        },
        metadata: {
            customer_id: customer_id,
            'JLR-PPC-ID': '12345'
        },
    });

    // Starting a subscription 30 days from now
    const schedule = await stripe.subscriptionSchedules.create({
        customer: customer_id,
        start_date: Math.floor(new Date() / 1000),
        end_behavior: 'release',
        phases: [
            {
                items: [{
                    price: PPCprice.id,
                    quantity: 1
                }],
                iterations: 24,
                collection_method: 'send_invoice',
                invoice_settings: {
                    days_until_due: 30
                }

            }
        ],
    });


    let items;
    if (breakdown) {
        const breakdownPrice = await _getBreakdownPrice()
        items = [{ price: breakdownPrice }]

    }

    const subscription = await stripe.subscriptions.update(schedule.subscription, {
        description: 'PPC Repayments',
        collection_method: 'send_invoice',
        days_until_due: 0,
        items,
        payment_settings: {
            payment_method_types: ['customer_balance', 'bacs_debit'],
            payment_method_options: {
                customer_balance: {
                    funding_type: 'bank_transfer',
                    bank_transfer: {
                        type: 'gb_bank_transfer',
                    },
                },
            },
        },
    })


    let invoice = await stripe.invoices.update(subscription.latest_invoice, {
        payment_settings: {
            payment_method_types: ['bacs_debit'],
        },
        metadata: {
            SAP_INVOICE_ID: '1234'
        }
    })

    invoice = await stripe.invoices.finalizeInvoice(subscription.latest_invoice);

    const intent = await stripe.paymentIntents.retrieve(invoice.payment_intent)

    await stripe.paymentIntents.update(intent.id, {
        payment_method_options: {
            bacs_debit: {
                setup_future_usage: 'off_session'

            }
        }
    })

    res.status(200).json({ client_secret: intent.client_secret })
}
