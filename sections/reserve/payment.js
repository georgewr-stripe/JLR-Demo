import React from "react"
import SectionTransition from "../../lib/sectionTransition";
import { Elements } from '@stripe/react-stripe-js'

import { currencyFormatter, getStripe } from "../../utils";
import ReservationPaymentForm from "./paymentForm";


const appearance = {
    theme: 'stripe',

    variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#ffffff',
    }
};

const ReservationPaymentSection = ({ show, setSection, total, car, config, client_secret }) => {

    const stripePromise = getStripe()
    const options = {
        clientSecret: client_secret,
        appearance
    }

    if (!client_secret) {
        return <></>
    }

    return (
        <Elements stripe={stripePromise} options={options}>
            <SectionTransition show={show}>
                <div className={`bg-darkGreen pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14 h-screen flex items-center `}>
                    <div className="mx-auto max-w-7xl lg:px-8">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
                                <div className="lg:py-24">

                                    <h1 className="mt-4 text-4xl font-bold color-white text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                                        <span className="block text-white">What a Beast! </span>
                                        <span className="block text-white bg-clip-text pb-3 sm:pb-5">

                                        </span>
                                    </h1>
                                    <div className="flex flex-row w-full justify-between">
                                        <div>
                                            <p className="text-base text-bold text-gray-300 sm:text-xl lg:text-lg xl:text-xl">
                                                {car.name}
                                            </p>
                                            {config.map(conf => {
                                                return <p className="text-base text-gray-300 sm:text-sm lg:text-sm xl:text-sm">- {conf.name}</p>
                                            })}
                                        </div>
                                        <p className=" text-xl text-right text-gray-300 text-bold">
                                            {currencyFormatter.format(total)}
                                        </p>
                                    </div>
                                    <div className="mt-10 sm:mt-12">
                                        <ReservationPaymentForm setSection={setSection} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 -mb-16 sm:-mb-48 lg:relative lg:m-0">
                                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                                    {/* Illustration taken from Lucid Illustrations: https://lucid.pixsellz.io/ */}
                                    <img
                                        className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                                        src='/defender.png'
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionTransition>
        </Elements>
    )
}

export default ReservationPaymentSection