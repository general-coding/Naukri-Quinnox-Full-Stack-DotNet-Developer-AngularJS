import React from 'react';
import { ShippingSlip } from '../models';

interface Props {
    shippingSlip: ShippingSlip;
    formatCurrency: (amount: number) => string;
    total: number;
}

const CheckoutScreen: React.FC<Props> = ({ shippingSlip, formatCurrency, total }) => (
    <div className="container d-flex justify-content-center align-items-center flex-column mt-5 mb-5">
        <h2 className="mb-4">Shipping Slip</h2>
        <p>Order #: {shippingSlip.orderNumber}</p>
        <p>Customer ID: {shippingSlip.customerId}</p>
        <p>Item lines:</p>
        <div className="text-start w-75 mt-3 border-top pt-3">
            <ul className="list-unstyled">
                {shippingSlip.shippedItems.map((item, idx) => (
                    <li key={idx}>
                        {item.product.name} "{item.product.description}" - Qty: {item.quantity}
                    </li>
                ))}
            </ul>
        </div>

        <p className="fw-bold mt-3">Total: {formatCurrency(total)}</p>
    </div>
);

export default CheckoutScreen;