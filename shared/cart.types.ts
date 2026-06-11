import type { Product } from "./product.types";

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  user: string;
  clerkId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CartItemAddInput {
  productId: string;
  quantity?: number;
}

export interface CartItemUpdateInput {
  productId: string;
  quantity: number;
}

export interface CartItemRemoveInput {
  productId: string;
}
