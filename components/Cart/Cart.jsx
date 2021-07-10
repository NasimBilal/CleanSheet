import React from 'react'
import {Container, Grid, Typography, Button} from '@material-ui/core';
import useStyles from './styles';
import CartItem from './CartItem/CartItem';
import {Link} from 'react-router-dom'

const  Cart=({cart, handleCartQty, handleRemove, Empty}) => {
    const classes = useStyles();
    const EmptyCart = ()=> {
        return(
        <Typography variant="subtitle1">You have no Items in your cart, 
            <Link to="/" className={classes.link}> Add some in your Cart</Link>
        </Typography>
    )}
    const FilledCart = () => {
        return (
        <>
            <Grid container spacing={3}>
                {cart?.line_items?.map((item) =>(
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem item={item} handleCartQty={handleCartQty} handleRemove={handleRemove}/>
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">
                    SubTotal: {cart?.subtotal?.formatted_with_symbol}
                </Typography>
                <div>
                    <Button onClick={Empty} className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary">Empty Cart</Button>
                    <Link to='/checkout'>
                        <Button className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary">CheckOut</Button>
                    </Link>
                </div>
            </div>
        </>)
    }
    return (
        <Container>
            <div className={classes.toolbar}/>
            <Typography variant="h3" gutterBottom>
                Your Shopping Cart
            </Typography>
            {!cart?.line_items?.length ? <EmptyCart/> : <FilledCart/>}
        </Container>
    )
}

export default Cart

