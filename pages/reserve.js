
import { useRouter } from 'next/router'
import * as React from 'react'
import CatalogueSection from '../sections/reserve/catalogue'
import ReservationPaymentSection from '../sections/reserve/payment'
import PaymentConfirmationSection from '../sections/reserve/paymentConfirmation'
import ToolbarSection from '../sections/toolbar'

export default function TestDrive() {

    const router = useRouter()
    const sections = {
        catalogue: CatalogueSection,
        reservationPayment: ReservationPaymentSection,
        paymentConfirmation: PaymentConfirmationSection
    }

    React.useEffect(() => {
        if (router.query.section) {
            setSection([router.query.section, {}])
        }
    }, [])


    const [section, setSection] = React.useState(['catalogue', {}])


    const handleSectionChange = (sectionName, props) => {
        router.push('/reserve?section=' + sectionName, undefined, { shallow: true })
        setSection([sectionName, props])
    }

    const sectionContent = React.useMemo(() => {
        return Object.entries(sections).map(([key, Section]) => {
            return <Section key={key} show={section[0] == key} setSection={handleSectionChange}  {...section[1]} />
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


