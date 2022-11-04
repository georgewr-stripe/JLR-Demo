import React from "react"
import SectionTransition from "../../lib/sectionTransition";

const PaymentConfirmationSection = ({ show, setSection, car }) => {

    return (
        <SectionTransition show={show}>
            <div className={`bg-darkGreen pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14 h-screen flex items-center `}>
                <div className="mx-auto max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                        <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
                            <div className="lg:py-24">

                                <h1 className="mt-4 text-4xl font-bold color-white text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                                    <span className="block text-white" >Payment Confirmed </span>
                                    <span className="block text-white bg-clip-text pb-3 sm:pb-5">

                                    </span>
                                </h1>
                                <p className="text-base text-gray-300 sm:text-xl lg:text-lg xl:text-xl">
                                    You're new Defender is reserved!
                                </p>

                            </div>
                        </div>
                        <div className="mt-12 -mb-16 sm:-mb-48 lg:relative lg:m-0">
                            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                                {/* Illustration taken from Lucid Illustrations: https://lucid.pixsellz.io/ */}
                                <img
                                    className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                                    src="/defender.png"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div></SectionTransition>)
}

export default PaymentConfirmationSection