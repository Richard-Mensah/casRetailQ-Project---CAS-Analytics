import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Customer, Supplier, InventoryItem, Sale, Expense, Alert, BusinessProfile } from './types';

interface AppContextType {
  customers: Customer[];
  suppliers: Supplier[];
  inventory: InventoryItem[];
  sales: Sale[];
  expenses: Expense[];
  alerts: Alert[];
  businessProfile: BusinessProfile;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  addSale: (sale: Omit<Sale, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  updateBusinessProfile: (profile: BusinessProfile) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    name: 'RetailIQ',
    address: '',
    phone: '',
    email: '',
  });

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = { ...customer, id: Date.now().toString() };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = { ...supplier, id: Date.now().toString() };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = { ...item, id: Date.now().toString() };
    setInventory(prev => [...prev, newItem]);
  };

  const addSale = (sale: Omit<Sale, 'id'>) => {
    const newSale: Sale = { ...sale, id: Date.now().toString() };
    setSales(prev => [...prev, newSale]);
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expense, id: Date.now().toString() };
    setExpenses(prev => [...prev, newExpense]);
  };

  const addAlert = (alert: Omit<Alert, 'id'>) => {
    const newAlert: Alert = { ...alert, id: Date.now().toString() };
    setAlerts(prev => [...prev, newAlert]);
  };

  const updateBusinessProfile = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
  };

  const value: AppContextType = {
    customers,
    suppliers,
    inventory,
    sales,
    expenses,
    alerts,
    businessProfile,
    addCustomer,
    addSupplier,
    addInventoryItem,
    addSale,
    addExpense,
    addAlert,
    updateBusinessProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
    expenses,
    alerts,
    businessProfile,
    addCustomer,
    addSupplier,
    addInventoryItem,
    addSale,
    addExpense,
    addAlert,
    updateBusinessProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
