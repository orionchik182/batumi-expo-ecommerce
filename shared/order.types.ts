import type { Product } from "./product.types";
import type { User } from "./user.types";

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
  product: Product;
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
  user: string | User;
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
