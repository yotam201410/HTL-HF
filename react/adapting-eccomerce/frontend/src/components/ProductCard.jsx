import React from 'react';

export const ProductCard = ({ id, name, provider, description, category, price, imageUrl }) => {
    const addToCart = (event) => {
        event.stopPropagation();
        // update store
        console.log("added to cart");
    };

    const moveToProductPage = (event) => {
        console.log("moving to page of product: " + id);
    };

    return (
        <div class="card" style={{ width: '15rem', height: '30rem' }} onClick={moveToProductPage} >
            <img src={'../assets/' + imageUrl} class="card-img-top" style={{ height: '15rem' }} alt="..." />
            <div class="card-body mx-auto">
                <h5 class="card-title">{name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">from: {provider}</h6>
                <h6 class="card-subtitle mb-2 text-muted">category: {category}</h6>
                <p class="card-text">{description}</p>
                <h6 class="card-text font-weight-bold">{price}$</h6>
                <button class="btn btn-primary" onClick={addToCart}>Add to cart</button>
            </div >
        </div >)
}