const stripe = require('stripe')(process.env.STRIPE_SK)

const productUUID = 'PPC'

export default async () => {

    try {
        for await (const product of stripe.products.list({ limit: 20 })) {
            if (product.metadata?.code === productUUID) {
                return product.id
            }
        }

    } catch {
        //pass
    }

    const product = await stripe.products.create({
        name: 'PPC Repayment',
        metadata: {
            code: productUUID
        }
    })

    return product.id

}