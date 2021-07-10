import React, {useEffect} from 'react';
import {Button, Typography, Divider} from '@material-ui/core';
import {Elements, ElementsConsumer, CardElement} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Review from './Review';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY)

function PaymentForm({checkoutToken, backStep, shippingData, handleCaptureCheckOut, nextStep, timeout}) {
    const windowAlert = () => {
        alert("This is a demo App, use card no: 4242 4242 4242 4242 MM/YY: 04/24 CVC: 242")
    }
    const handleSubmit = async (event, elements, stripe) => {
        event.preventDefault();

        if(!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
    
        
        const {error, paymentMethod} = await stripe.createPaymentMethod({ type: 'card', card: cardElement});
        if(error){
            console.log('[error]',error);
        }else {
            const orderData = {
                line_items: checkoutToken.live.line_items,
                customer: { firstname: shippingData.firstname, lastname: shippingData.lastname, email: shippingData.email},
                shipping: {name: 'International', street: shippingData.address1, town_city: shippingData.city, 
                    state: shippingData.region, postal_zip_code: shippingData.zip, country: shippingData.country},
                fulfillment: { shipping_method: shippingData.option },
                payment: {
                    gateway: 'stripe',
                    stripe: {
                        payment_method_id: paymentMethod.id
                    }
                }
            }
            handleCaptureCheckOut(checkoutToken.id, orderData);
            timeout();
            nextStep();
        }
        
    }

    useEffect(() => {
        windowAlert();
    }, [])
    
    return (
        <>
           <Review checkoutToken={checkoutToken}/>
           <Divider/>
           <Typography variant="h6" gutterBottom style={{margin: '20px 0'}}>Payment Details</Typography>
           <Elements stripe={stripePromise}>
                <ElementsConsumer>
                    {
                        ({elements, stripe})=>(
                            <form onSubmit={(e)=>handleSubmit(e, elements, stripe)}>
                                <CardElement/>
                                <br /><br />
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <Button variant="outlined" onClick={backStep}>Back</Button>
                                    <Button variant="contained" type="submit" color="primary" disabled={!stripe}>
                                        Pay : {checkoutToken.live.subtotal.formatted_with_symbol}
                                    </Button>
                                </div>
                            </form>
                        )
                    }
                </ElementsConsumer>
           </Elements>
        </>
    )
}

export default PaymentForm
