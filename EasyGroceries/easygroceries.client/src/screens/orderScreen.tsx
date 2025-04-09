import React from 'react';
import { OrderLine } from '../models';

interface Props {
    basket: OrderLine[];
    includeLoyalty: boolean;
    setIncludeLoyalty: (value: boolean) => void;
    shippingInfo: string;
    setShippingInfo: (value: string) => void;
    calculateTotal: () => string;
    handleSubmit: () => void;
    formatCurrency: (amount: number) => string;
}

const OrderScreen: React.FC<Props> = ({ basket, includeLoyalty, setIncludeLoyalty, shippingInfo, setShippingInfo, calculateTotal, handleSubmit, formatCurrency }) => (
    <div className="container d-flex justify-content-center align-items-center flex-column mt-5 mb-5">
        <h2 className="mb-4">Basket</h2>
        {basket.length > 0 ? (
            <table className="table table-bordered w-75 text-start">
                <thead className="table-light">
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Line Total</th>
                    </tr>
                </thead>
                <tbody>
                    {basket.map((line, idx) => (
                        <tr key={idx}>
                            <td>{line.product.name}</td>
                            <td>{line.quantity}</td>
                            <td>{formatCurrency(line.product.price * line.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p className="text-muted">Your basket is empty.</p>
        )}

        <div className="form-check mt-3">
            <input
                className="form-check-input"
                type="checkbox"
                checked={includeLoyalty}
                onChange={e => setIncludeLoyalty(e.target.checked)}
                id="loyaltyCheck"
            />
            <label className="form-check-label" htmlFor="loyaltyCheck">
                Loyalty Membership ({formatCurrency(5)}, 20% off)
            </label>
        </div>

        <input
            type="text"
            value={shippingInfo}
            onChange={e => setShippingInfo(e.target.value)}
            placeholder="Shipping address"
            className="form-control mt-3 w-75"
        />

        <p className="mt-3 fw-bold">Total: {calculateTotal()}</p>

        <button onClick={handleSubmit} className="btn btn-primary mt-2">
            Submit Order
        </button>
    </div>
);

export default OrderScreen;