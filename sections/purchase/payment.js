
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import SectionTransition from '../../lib/sectionTransition';
import { currencyFormatter } from '../../utils';


const Payment = ({ amount, isPPC, monthlyAmount }) => {

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const { protocol, hostname, port } = window.location
        const redirectURL = `${protocol}//${hostname}${port && ':' + port}/purchase?section=paymentConfirmation`

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

    return <SectionTransition show={!!stripe}><form onSubmit={handleSubmit}>
        <PaymentElement appearance={{ theme: 'stripe', variables: { colorText: '#FFFFFF' } }} />
        <button
            className="block bottom-6  mt-4 w-full px-10 rounded-md bg-green py-3 font-medium text-white shadow hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
            Pay {currencyFormatter.format(amount)}{isPPC && ' Deposit'} {monthlyAmount > 0 && `then ${currencyFormatter.format(monthlyAmount)} /mo`}
        </button>
    </form>
    </SectionTransition>

}

export default Payment