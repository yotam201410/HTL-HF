import React from 'react';
import './CartItem.css' 

export const CartItem = ({ product, amount, handleRemove }) => {
    const total = product.price * amount;

    return (<div class="list-group-item d-flex justify-content-between align-items-center">
        <div class="product-info d-flex align-items-center">
            <img src={'../assets/' + product.imageUrl} alt="Product Image" class="product-img mr-3" />
            <div>
                <h5 class="mb-1">{product.name}</h5>
                <p class="mb-1 text-muted">Provider: {product.provider}</p>
                <p class="mb-1 text-muted">Category: {product.category}</p>
                <p class="mb-1">Price: <strong>{product.price}$</strong></p>
                <p class="mb-1">Amount: <strong>{amount}</strong></p>
                <p class="mb-1">Total: <strong>{total}$</strong></p>
            </div>
        </div>
        <div>
            <button class="btn btn-danger" onClick={handleRemove}>Remove One</button>
        </div>
    </div>)
}