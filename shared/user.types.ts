export interface User {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  imageUrl: string;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id: string;
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface AddressFormData extends Omit<Address, "_id"> { }

export interface AddressFormModalProps {
  visible: boolean;
  isEditing: boolean;
  addressData: AddressFormData;
  isAddingAddress: boolean;
  isUpdatingAddress: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onFormChange: (addressData: AddressFormData) => void;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string | User;
  orderId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}