import React,{useState, useEffect} from 'react'
import NavBar from './components/NavBar/NavBar';
import ProductHub from './components/Products/ProductHub';
import Cart from './components/Cart/Cart';
import Checkout from './components/CheckoutForm/Checkout/Checkout';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {commerce} from './lib/commerce';
import {CssBaseline} from '@material-ui/core';

function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const fetchProducts = async() => {
        const { data }=await commerce.products.list();
        setProducts(data)
    }
    const fetchCart = async() => {
        setCart(await commerce.cart.retrieve())
    }
    const handleAddToCart = async (productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity);
        setCart(item.cart);
    }
    const handleCartQty = async (productId, quantity) => {
        const {cart} = await commerce.cart.update(productId, {quantity})
        setCart(cart)
    }
    const handleRemove = async (productId) => {
        const {cart} = await commerce.cart.remove(productId)
        setCart(cart)
    }
    const Empty = async () => {
        const {cart} = await commerce.cart.empty();
        setCart(cart)
    }
    const refreshCart = async()=> {
        const newCart = await commerce.cart.refresh();
        setCart(newCart);
    }
    const handleCaptureCheckOut = async(checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
            setOrder(incomingOrder);
            refreshCart();
        } catch (error) {
            setErrorMessage(error.data.error.message)
        }
    }
    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);
    return (
        <BrowserRouter>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <CssBaseline/>
                
                <Switch>
                    <Route exact path="/">
                        <NavBar totalItems={cart.total_items} />
                        <ProductHub products={products} onAddToCart={handleAddToCart}/>
                    </Route>
                    <Route path="/cart">
                    <NavBar totalItems={cart.total_items} />
                        <Cart 
                        cart={cart}
                        handleCartQty={handleCartQty}
                        handleRemove={handleRemove}
                        Empty={Empty} />
                    </Route>
                    <Route path='/checkout'>
                    <NavBar totalItems={cart.total_items} />
                        <Checkout 
                        order={order}
                        error={errorMessage}
                        handleCaptureCheckOut={handleCaptureCheckOut}
                        cart={cart}/>
                    </Route>
                </Switch>
            </div>
        </BrowserRouter>

    )
}

export default App
