import { Typography, Paper, Stepper, Step, StepLabel, Button, Divider, CircularProgress, CssBaseline } from '@material-ui/core'
import React, {useState, useEffect} from 'react';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import {commerce} from '../../../lib/commerce';
import {Link, useHistory} from 'react-router-dom';


const steps = ['Shipping Address', 'Payment Details']
function Checkout({cart, handleCaptureCheckOut, error, order}) {
    const history = useHistory();
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const [isFinished, setIsFinished] = useState(false)
    useEffect(()=> {
        const generateToken = async() => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'})
                setCheckoutToken(token)
            } catch (error) {
                history.push("/")
            }
        }
        generateToken();
    }, [cart])
    const nextStep = () => setActiveStep((prevStep) => prevStep +1 )
    const backStep = () => setActiveStep((prevStep) => prevStep -1 )
    const next = (data) => {
        setShippingData(data);
        nextStep();
    }
    const timeout = () => {
        setTimeout(()=> {
            setIsFinished(true)
        }, 3000)
    }
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const Form = () => activeStep === 0? <AddressForm checkoutToken={checkoutToken} next={next}/> : <PaymentForm 
        shippingData={shippingData} checkoutToken={checkoutToken} timeout={timeout} handleCaptureCheckOut={handleCaptureCheckOut} nextStep={nextStep} backStep={backStep}/>
        let Confirmation = () => order.customer ?(
            <>
                <div>
                    <Typography variant="h5">Thank you for your Purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
                    <Divider className={classes.divider}/>
                    <Typography variant="subtitle1">Order ref: {order.customer_reference}</Typography>
                </div>
                <br />
                <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
            </>
        ) : isFinished ? (
            <>
                <div>
                    <Typography variant="h5">Thank you for your Purchase</Typography>
                </div>
                <br />
                <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
            </>
        ) : (
            <div className={classes.spinner}>
                <CircularProgress/>
            </div>
        );

        if(error) {
            <>
            <Typography variant="h5">Error : {error}</Typography>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
            </>
        }
    return (
        <>
        <CssBaseline/>
            <div className={classes.toolbar}/>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">CheckOut</Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map(step=>(
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation/> : checkoutToken && <Form/>}
                </Paper>
            </main>  
        </>
    )
}

export default Checkout
