export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  averageRating: number;
  totalReviews: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface ImageItem {
  id: string;
  url: string;
  file: File | null;
}