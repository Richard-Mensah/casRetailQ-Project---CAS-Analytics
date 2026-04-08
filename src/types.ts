export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  supplierId: string;
}

export interface Sale {
  id: string;
  customerId: string;
  items: { itemId: string; quantity: number }[];
  total: number;
  date: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface Alert {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
}

export interface BusinessProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
}