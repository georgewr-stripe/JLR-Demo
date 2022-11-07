
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';


const ReservationPaymentForm = () => {

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const { protocol, hostname, port } = window.location
        const redirectURL = `${protocol}//${hostname}${port && ':' + port}/reserve?section=paymentConfirmation`

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: redirectURL,
            },
        });


        if (error) {
            console.log(error)
        } else {
            setSection('PaymentConfirmation', {})
        }
    };

    return <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button
            className="block bottom-6  mt-2 w-full px-10 rounded-md bg-green py-3 font-medium text-white shadow hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
            Reserve for £99
        </button>
    </form>

}

export default ReservationPaymentForm