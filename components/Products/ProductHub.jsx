import React from 'react';
import Products from './Products';
import './producthub.css';
import { CssBaseline } from '@material-ui/core';

function ProductHub({products, onAddToCart}) {
    return (
        <div className="producthub">
            <CssBaseline/>
            <Products product={products} onAddToCart={onAddToCart}/>
        </div>
    )
}

export default ProductHub
