import { loadStripe } from '@stripe/stripe-js';
import nextSession from "next-session";


export const getSession = nextSession();


let stripePromise;
export const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK);
    }
    return stripePromise;
};


