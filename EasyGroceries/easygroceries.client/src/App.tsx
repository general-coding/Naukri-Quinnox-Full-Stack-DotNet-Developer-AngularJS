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

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProducts();
            setProducts(data);
        };
        fetchProducts();
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

    return (
        <div className="container text-center">
            <div className="my-4">
                <h1 className="display-5">EasyGroceries</h1>
            </div>

            <div className="d-flex justify-content-center align-items-center flex-column min-vh-100">
                <ProductListScreen
                    products={products}
                    addToBasket={addToBasket}
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
                    )}
            </div>
        </div>
    );
};

export default App;

//WeatherForecast - Default

//import { useEffect, useState } from 'react';
//import './App.css';

//interface Forecast {
//    date: string;
//    temperatureC: number;
//    temperatureF: number;
//    summary: string;
//}

//function App() {
//    const [forecasts, setForecasts] = useState<Forecast[]>();

//    useEffect(() => {
//        populateWeatherData();
//    }, []);

//    const contents = forecasts === undefined
//        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
//        : <table className="table table-striped" aria-labelledby="tableLabel">
//            <thead>
//                <tr>
//                    <th>Date</th>
//                    <th>Temp. (C)</th>
//                    <th>Temp. (F)</th>
//                    <th>Summary</th>
//                </tr>
//            </thead>
//            <tbody>
//                {forecasts.map(forecast =>
//                    <tr key={forecast.date}>
//                        <td>{forecast.date}</td>
//                        <td>{forecast.temperatureC}</td>
//                        <td>{forecast.temperatureF}</td>
//                        <td>{forecast.summary}</td>
//                    </tr>
//                )}
//            </tbody>
//        </table>;

//    return (
//        <div>
//            <h1 id="tableLabel">Weather forecast</h1>
//            <p>This component demonstrates fetching data from the server.</p>
//            {contents}
//        </div>
//    );

//    async function populateWeatherData() {
//        const response = await fetch('weatherforecast');
//        if (response.ok) {
//            const data = await response.json();
//            setForecasts(data);
//        }
//    }
//}

//export default App;