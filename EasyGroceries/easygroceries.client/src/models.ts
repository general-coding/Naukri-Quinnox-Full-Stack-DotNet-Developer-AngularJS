export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    isPhysical: boolean;
}

export interface OrderLine {
    product: Product;
    quantity: number;
}

export interface Order {
    customerId: number;
    shippingInfo: string;
    lines: OrderLine[];
    includeLoyalty: boolean;
}

export interface ShippingSlip {
    customerId: number;
    orderNumber: number;
    shippedItems: OrderLine[];
}
