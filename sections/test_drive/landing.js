import React from "react"
import SectionTransition from "../../lib/sectionTransition";
import { getStripe } from "../../utils";

const LandingSection = ({ show, setSection }) => {

    const [stripe, setStripe] = React.useState()

    React.useEffect(() => {
        getStripe().then(st => setStripe(st))
    }, [])


    const [email, setEmail] = React.useState('');

    const verify = async (e) => {

        e.preventDefault()

        if (!email) {
            alert('Enter your email')
            return
        }

        setSection('verification', { email })
    }


    return (
        <SectionTransition show={show}>
            <div className={`bg-darkGreen pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14 h-screen flex items-center `}>
                <div className="mx-auto max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                        <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
                            <div className="lg:py-24">

                                <h1 className="mt-4 text-4xl font-bold color-white text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                                    <span className="block text-white">The all new </span>
                                    <span className="block text-white bg-clip-text pb-3 sm:pb-5">
                                        Defender
                                    </span>
                                </h1>
                                <p className="text-base text-gray-300 sm:text-xl lg:text-lg xl:text-xl">
                                    The epitome of toughness, of ruggedness, of strength and most importantly of capability.
                                </p>
                                <div className="mt-10 sm:mt-12">
                                    <form action="#" className="sm:mx-auto sm:max-w-xl lg:mx-0">
                                        <div className="sm:flex">
                                            <div className="min-w-0 flex-1">
                                                <label htmlFor="email" className="sr-only">
                                                    Email address
                                                </label>
                                                <input
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    id="email"
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="block w-full rounded-md border-0 px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                                                />
                                            </div>
                                            <div className="mt-3 sm:mt-0 sm:ml-3">
                                                <button
                                                    disabled={!stripe}
                                                    onClick={verify}
                                                    className="block w-full rounded-md bg-green py-3 px-4 font-medium text-white shadow hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                                                >
                                                    Book a Test Drive
                                                </button>
                                            </div>
                                        </div>

                                    </form>
                                </div>
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

export default LandingSection