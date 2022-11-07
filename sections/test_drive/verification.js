import React from "react"
import SectionTransition from "../../lib/sectionTransition";
import { getStripe } from "../../utils";
import { setCookie } from 'cookies-next';
import Spinner from "../../lib/spinner";

const VerificationSection = ({ email, show, setSection }) => {

    const [name, setName] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const [stripe, setStripe] = React.useState()

    React.useEffect(() => {
        getStripe().then(st => setStripe(st))
    }, [])


    const verify = async (e) => {
        setLoading(true)
        e.preventDefault()

        if (!name) {
            alert('Please enter your name')
            return
        }

        const req = await fetch('/api/verification', {
            method: 'POST',
            body: JSON.stringify({ email, name }),
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        })

        if (req.ok) {
            const { client_secret, customer_id } = await req.json()

            setCookie('jlr_customer_id', customer_id)
            setLoading(false)

            const { error } = await stripe.verifyIdentity(client_secret);

            if (error) {
                console.log('[error]', error);
            } else {
                console.log('Verification submitted!');
                setSection('testDrive', {})
            }
        }
        setLoading(false)
    }


    return (
        <SectionTransition show={show}>
            <div className={`bg-darkGreen pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14 h-screen flex items-center `}>
                <div className="mx-auto max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                        <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
                            <div className="lg:py-24">

                                <h1 className="mt-4 text-4xl font-bold color-white text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                                    <span className="block text-white">Set Up Your </span>
                                    <span className="block text-white bg-clip-text pb-3 sm:pb-5">
                                        JLR Account
                                    </span>
                                </h1>
                                <p className="text-base text-gray-300 sm:text-xl lg:text-lg xl:text-xl">
                                    To book a test drive we just need to verify your identity, please have your driving license at hand.
                                </p>
                                <div className="mt-10 sm:mt-12">
                                    <form action="#" className="sm:mx-auto sm:max-w-xl lg:mx-0">
                                        <div className="sm:flex">
                                            <div className="min-w-0 flex-1">
                                                <label htmlFor="email" className="sr-only">
                                                    Your Name
                                                </label>
                                                <input
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    id="name"
                                                    type="text"
                                                    placeholder="Enter your name"
                                                    className="block w-full rounded-md border-0 px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                                                />
                                            </div>
                                            <div className="mt-3 sm:mt-0 sm:ml-3">
                                                <button
                                                    disabled={!stripe}
                                                    onClick={verify}
                                                    className="flex flex-row justify-around w-full px-10 rounded-md bg-green py-3 font-medium text-white shadow hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                                                >
                                                    Verify
                                                    {loading && <Spinner />}
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

export default VerificationSection