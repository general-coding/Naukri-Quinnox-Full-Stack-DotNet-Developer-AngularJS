import React, { useEffect, useState } from 'react';
import { Product, OrderLine, Order, ShippingSlip } from './models';
import { getProducts, submitOrder } from './services/api';
import './App.css';

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [basket, setBasket] = useState<OrderLine[]>([]);
    const [shippingInfo, setShippingInfo] = useState('');
    const [includeLoyalty, setIncludeLoyalty] = useState(false);
    const [shippingSlip, setShippingSlip] = useState<ShippingSlip | null>(null);

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
        return total;
    };

    const handleSubmit = async () => {
        if (!shippingInfo.trim()) return;
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
        <div className="p-4 font-sans">
            <h1 className="text-2xl font-bold mb-4">EasyGroceries</h1>

            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products && products.map(p => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.description}</td>
                            <td>{p.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/*<div className="grid grid-cols-2 gap-4">*/}
            {/*    {products && products.map(p => (*/}
            {/*        <div key={p.id} className="border p-4 rounded">*/}
            {/*            <h2 className="text-lg font-semibold">{p.name}</h2>*/}
            {/*            <p>{p.description}</p>*/}
            {/*            <p>{formatCurrency(p.price)}</p>*/}
            {/*            <button onClick={() => addToBasket(p)} className="mt-2 px-4 py-1 bg-green-600 text-white rounded">*/}
            {/*                Add to Basket*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}

            <div className="mt-6">
                <h2 className="text-xl font-semibold">Basket</h2>
                {basket && basket.map((line, idx) => (
                    <p key={idx}>{line.product.name} x{line.quantity}</p>
                ))}
                <label className="block mt-2">
                    <input type="checkbox" checked={includeLoyalty} onChange={e => setIncludeLoyalty(e.target.checked)} /> Loyalty Membership ({formatCurrency(5)}, 20% off)
                </label>
                <input type="text" value={shippingInfo} onChange={e => setShippingInfo(e.target.value)} placeholder="Shipping address" className="border mt-2 p-2 w-full" />
                <p className="mt-2 font-bold">Total: {formatCurrency(calculateTotal())}</p>
                <button onClick={handleSubmit} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Submit Order</button>
            </div>

            {shippingSlip && (
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-xl font-bold">Shipping Slip</h2>
                    <p>Order #: {shippingSlip.orderNumber}</p>
                    <ul>
                        {shippingSlip.shippedItems.map((item, idx) => (
                            <li key={idx}>{item.product.name} x{item.quantity}</li>
                        ))}
                    </ul>
                </div>
            )}
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