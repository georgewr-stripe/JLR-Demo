
import { useRouter } from 'next/router'
import * as React from 'react'
import ReservationsSection from '../sections/purchase/reservations'
import ToolbarSection from '../sections/toolbar'


import { getCookie } from 'cookies-next'
import { cars, configurations } from "../sections/reserve/catalogue";
import PaymentConfirmationSection from '../sections/purchase/paymentConfirmation'
import PPCSection from '../sections/purchase/ppc'

const stripe = require('stripe')(process.env.STRIPE_SK)


export default function Purchase(props) {

    const router = useRouter()
    const sections = {
        reservations: ReservationsSection,
        paymentConfirmation: PaymentConfirmationSection,
        ppc: PPCSection
    }
    const [section, setSection] = React.useState(['reservations', {}])

    React.useEffect(() => {
        if (router.query.section) {
            if (router.query.section !== section[0]) {
                setSection([router.query.section, {}])
            }
        }
    }, [section, router.query])




    const handleSectionChange = (sectionName, props) => {
        router.push('/purchase?section=' + sectionName, undefined, { shallow: true })
        setSection([sectionName, props])
    }

    const sectionContent = React.useMemo(() => {
        return Object.entries(sections).map(([key, Section]) => {
            return <Section key={key} show={section[0] == key} setSection={handleSectionChange}  {...section[1]} {...props} />
        })
    }, [section])


    return <div className="bg-white h-full">
        <div className="relative overflow-hidden">
            <ToolbarSection />
            <main className='h-screen'>
                {sectionContent}
            </main>
        </div>
    </div>

}


export async function getServerSideProps({ req, res, query }) {

    const props = { reservations: [], breakdown: false };

    const customer_id = getCookie('jlr_customer_id', { req, res })

    const paymentIntents = await stripe.paymentIntents.list({
        customer: customer_id,
        limit: 50,
    });

    if (paymentIntents.data.length) {
        const reservations = paymentIntents.data.filter(intent => {
            return intent.metadata.type == 'reservation-fee'
        })

        if (reservations.length) {
            reservations.map(reservation => {
                const meta = reservation.metadata
                props.reservations.push({
                    car: cars.filter(c => c.code == meta.car)[0],
                    config: configurations.filter(c => JSON.parse(meta.config).includes(c.code)),
                    total: Number(meta.total)
                })
            })

        }
    }

    if (query?.payment_intent) {
        try {
            const pi = await stripe.paymentIntents.retrieve(query.payment_intent)
            if (pi.metadata?.breakdown == 'true') {
                props.breakdown = true;
            }

        } catch (e) {
            console.log(e)
        }
    }

    console.log(props)

    return {
        props
    }

}
