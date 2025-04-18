import { Product, Order, ShippingSlip } from '../models';

export const getProducts = async (): Promise<Product[]> => {
    const res = await fetch('https://localhost:7172/api/Orders/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
};

export const submitOrder = async (order: Order): Promise<ShippingSlip> => {
    const res = await fetch('https://localhost:7172/api/Orders/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error('Failed to submit order');
    return res.json();
};
