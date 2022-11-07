const stripe = require('stripe')(process.env.STRIPE_SK)

const productUUID = 'BKDWN-CVR'

export default async () => {

    try {
        for await (const product of stripe.products.list({ limit: 20 })) {
            if (product.metadata?.code === productUUID) {
                return product.default_price
            }
        }

    } catch {
        //pass
    }

    const product = await stripe.products.create({
        name: 'Breakdown Cover',
        default_price_data: {
            currency: 'GBP',
            unit_amount: 2900,
            recurring: {
                interval: 'month'
            }
        },
        metadata: {
            code: productUUID
        }
    })

    return product.default_price

}