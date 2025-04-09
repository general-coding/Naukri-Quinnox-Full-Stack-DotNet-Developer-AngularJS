import React from 'react';
import { OrderLine, Product } from '../models';

interface Props {
    products: Product[];
    addToBasket: (product: Product) => void;
    removeFromBasket: (product: Product) => void;
    formatCurrency: (amount: number) => string;
    basket: OrderLine[];
}

const ProductListScreen: React.FC<Props> = ({ products, addToBasket, removeFromBasket, formatCurrency, basket }) => (
    <div className="container d-flex justify-content-center align-items-center flex-column mb-5">
        <h2 className="mb-4">Available Products</h2>
        <table className="table table-bordered w-75 text-start">
            <thead className="table-light">
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {products.map(p => {
                    const inBasket = basket.find(b => b.product.id === p.id);
                    return (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.description}</td>
                            <td>{formatCurrency(p.price)}</td>
                            <td>
                                <button
                                    onClick={() => addToBasket(p)}
                                    className="btn btn-success btn-sm me-2"
                                >
                                    Add
                                </button>
                                {inBasket && (
                                    <button
                                        onClick={() => removeFromBasket(p)}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Remove
                                    </button>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);

export default ProductListScreen;