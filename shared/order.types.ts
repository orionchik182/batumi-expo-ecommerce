export interface OrderUser {
  _id: string;
  name?: string;
  email?: string;
}

export interface OrderProduct {
  _id: string;
  name?: string;
  image?: string;
  price?: number;
}

export interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
}

export interface OrderItem {
  _id: string;
  product: string | OrderProduct;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface PaymentResult {
  id?: string;
  status?: string;
}

export interface Order {
  _id: string;
  user: string | OrderUser;
  clerkId: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentResult?: PaymentResult;
  totalPrice: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  deliveredAt?: string;
  paidAt?: string;
  shippedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}
