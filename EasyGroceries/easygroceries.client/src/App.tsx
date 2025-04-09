import React, { useEffect, useState } from 'react';
import { Order, OrderLine, Product, ShippingSlip } from './models';
import CheckoutScreen from './screens/checkoutScreen';
import OrderScreen from './screens/orderScreen';
import ProductListScreen from './screens/productListScreen';
import { getProducts, submitOrder } from './services/api';

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [basket, setBasket] = useState<OrderLine[]>([]);
    const [shippingInfo, setShippingInfo] = useState('');
    const [includeLoyalty, setIncludeLoyalty] = useState(false);
    const [shippingSlip, setShippingSlip] = useState<ShippingSlip | null>(null);
    const [orderTotal, setOrderTotal] = useState<number>(0);
    const [backendReady, setBackendReady] = useState<boolean>(false);

    useEffect(() => {
        const checkBackendAndLoad = async () => {
            let attempts = 0;
            const maxAttempts = 10;
            const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

            while (attempts < maxAttempts) {
                try {
                    const data = await getProducts();
                    setProducts(data);
                    setBackendReady(true);
                    break;
                } catch (error) {
                    attempts++;
                    console.warn(`Backend not ready. Retrying... (${attempts}/${maxAttempts})`);
                    await delay(1000);
                }
            }

            if (attempts === maxAttempts) {
                console.error('Failed to connect to backend after multiple attempts.');
            }
        };

        checkBackendAndLoad();
    }, []);

    const addToBasket = (product: Product) => {
        setBasket(prev => {
            const existing = prev.find(b => b.product.id === product.id);
            if (existing) {
                return prev.map(b =>
                    b.product.id === product.id ? { ...b, quantity: b.quantity + 1 } : b
                );
            } else {
                return [...prev, { product, quantity: 1 }];
            }
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
    };

    const calculateTotal = () => {
        let total = basket.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
        if (includeLoyalty) {
            total = total * 0.8 + 5;
        }
        return formatCurrency(total);
    };

    const handleSubmit = async () => {
        if (!shippingInfo.trim()) return;

        const totalAmount = basket.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
        const finalTotal = includeLoyalty ? totalAmount * 0.8 + 5 : totalAmount;
        setOrderTotal(finalTotal);

        const order: Order = {
            customerId: 1,
            shippingInfo,
            lines: basket,
            includeLoyalty,
        };
        try {
            const slip = await submitOrder(order);
            setShippingSlip(slip);
            setBasket([]);
            setShippingInfo('');
            setIncludeLoyalty(false);
        } catch (error) {
            console.error('Order submission failed', error);
        }
    };

    const removeFromBasket = (product: Product) => {
        setBasket(prev => {
            const existing = prev.find(b => b.product.id === product.id);
            if (!existing) return prev;

            if (existing.quantity === 1) {
                return prev.filter(b => b.product.id !== product.id);
            } else {
                return prev.map(b =>
                    b.product.id === product.id ? { ...b, quantity: b.quantity - 1 } : b
                );
            }
        });
    };

    return (
        <>
            <h1>EasyGroceries</h1>

            <ProductListScreen
                products={products}
                basket={basket}
                addToBasket={addToBasket}
                removeFromBasket={removeFromBasket}
                formatCurrency={formatCurrency}
            />

            <OrderScreen
                basket={basket}
                includeLoyalty={includeLoyalty}
                setIncludeLoyalty={setIncludeLoyalty}
                shippingInfo={shippingInfo}
                setShippingInfo={setShippingInfo}
                calculateTotal={calculateTotal}
                handleSubmit={handleSubmit}
                formatCurrency={formatCurrency}
            />

            {
                shippingSlip && (
                    <CheckoutScreen
                        shippingSlip={shippingSlip}
                        formatCurrency={formatCurrency}
                        total={orderTotal}
                    />
                )
            }
        </>
    );
};

export default App;