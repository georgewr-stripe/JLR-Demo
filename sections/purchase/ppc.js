import Image from "next/image";
import React from "react"
import { Switch } from '@headlessui/react'
import SectionTransition from "../../lib/sectionTransition";
import { Elements } from '@stripe/react-stripe-js'
import { currencyFormatter, getStripe } from "../../utils";
import Payment from "./payment";
import Spinner from "../../lib/spinner";
import { useRouter } from "next/router";


const appearance = {
    theme: 'stripe',

    variables: {
        colorText: 'white',
        // colorPrimary: '#ffffff',
        colorBackgroundText: 'black',
        colorPrimaryText: 'black',
        colorTextPlaceholder: 'black',
        colorIconTab: '#0F291D',
        colorIconTabHover: '#0B6836',
        colorIconTabSelected: '#0B6836',
        colorTextSecondary: 'black'
    },
    rules: {
        '.Input': {
            color: 'black'
        },
        '.TabLabel': {
            color: 'black'
        },
        '.Block': {
            color: 'black !important'
        },
        '.PickerItem': {
            color: 'black'
        },
        '.p-Logo': {
            color: 'black'
        }
    }
};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const PPCSection = ({ show, setSection, reservations, breakdown }) => {

    const [clientSecret, setClientSecret] = React.useState()
    const [reservation, setReservation] = React.useState()
    const [amountText, setAmountText] = React.useState(0)
    const [isPPC, setIsPPC] = React.useState(false)
    const [monthlyAmount, setMonthlyAmount] = React.useState(0)
    const [loading, setLoading] = React.useState(false);
    const stripePromise = getStripe()

    const router = useRouter();

    React.useEffect(() => {
        if (reservations.length) {
            setReservation(reservations[0])
        }
    }, [reservations])

    const total = React.useMemo(() => {
        if (reservation) {
            return (reservation.total / 100) - 5000 + (breakdown ? 29 : 0) - 99
        } return 0
    }, [breakdown, reservation])

    const loadPPC = async () => {
        setLoading(true)
        setIsPPC(true)
        const a = currencyFormatter.format(Math.ceil((total - 99 - 5000) / 24) + (breakdown ? 29 : 0))
        setAmountText(`${a} /mo`)
        const req = await fetch('/api/pay-by-ppc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reservation, breakdown, total })
        })

        if (req.ok) {
            const { client_secret } = await req.json()
            setClientSecret(client_secret)
        }
        setLoading(false)
    }


    React.useEffect(() => {
        console.log(reservation)
        if (reservation && !loading && show) {
            console.log('calling pay by ppc')
            loadPPC()
        }
    }, [breakdown, reservation, show])
    const paymentSection = React.useMemo(() => {

        if (clientSecret) {
            return <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                <Payment amountText={amountText} />
            </Elements>
        }

        return <img
            className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
            src="/defender.png"
            alt=""
        />
    }, [clientSecret])


    const reservationList = React.useMemo(() => {
        if (reservation) {
            return (
                <div className="flex flex-col w-full bg-grey rounded-lg p-6 pt-2 ">
                    <div className="text-xl font-bold text-gray-900 text-center">
                        {reservation.car.name}
                    </div>
                    <div className="flex flex-row w-full justify-between pt-4 items-stretch">
                        <div className="relative w-[200px] h-[200px]">
                            <Image src={reservation.car.img} layout={'fill'} objectFit={'contain'} alt={reservation.car.name} />

                        </div>
                        <ul role="list" className="divide-y divide-darkGrey">
                            {reservation.config.map((conf) => (
                                <li key={conf.code} className="flex py-4 text-right">
                                    <div className="ml-3 w-full">
                                        <p className="text-sm font-medium text-gray-900">{conf.name}</p>
                                        <p className="text-sm text-gray-500">{currencyFormatter.format(conf.price)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </div>
                    <div className="flex flex-row justify-between mb-2 align-middle items-center">
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">Add Breakdown Cover</p>
                            <p className="text-sm text-gray-500">{currencyFormatter.format(29)} /mo</p>
                        </div>
                        <Switch
                            disabled={!!clientSecret}
                            checked={breakdown}
                            className={classNames(
                                breakdown ? 'bg-green' : 'bg-darkGreen',
                                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-darkGrey focus:ring-offset-2'
                            )}
                        >
                            <span className="sr-only">Breakdown</span>
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    breakdown ? 'translate-x-5' : 'translate-x-0',
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-grey shadow ring-0 transition duration-200 ease-in-out'
                                )}
                            />
                        </Switch>
                    </div>

                    <div className="w-full border-darkGrey border-t-2 py-3" />
                    <div className="flex flex-row justify-between">
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">Reservation Fee</p>
                            <p className="text-sm text-gray-500">{currencyFormatter.format(-99)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{reservation.car.name}</p>
                            <p className="text-sm text-gray-500">{currencyFormatter.format(reservation.car.price)}</p>
                        </div>
                    </div>

                    <div className="text-lg pt-2">Total to Pay: {currencyFormatter.format(total)}</div>
                    <div className="flex flex-row justify-between pt-4">

                    </div>
                </div>
            )
        }

    })

    return (

        <SectionTransition show={show}>
            <div className={`bg-darkGreen pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14 h-screen flex items-center `}>
                <div className="mx-auto max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-20">
                        <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
                            <div className="lg:py-24">

                                <h1 className="mt-4 text-4xl font-bold color-white text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                                    {reservation ? (<><span className="block text-white">Your Landy </span>
                                        <span className="block text-white bg-clip-text pb-3 sm:pb-5">
                                            is Ready!
                                        </span></>) : <span className="block text-white">Looks like you don't have any reserved cars...</span>}

                                </h1>
                                {reservationList}

                            </div>
                        </div>
                        <div className="mt-12 -mb-16 sm:-mb-48 lg:relative lg:m-0 mx-auto flex items-center w-full">
                            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0 w-full">

                                {paymentSection}
                            </div>
                        </div>
                    </div>
                </div>
            </div></SectionTransition>)
}




export default PPCSection