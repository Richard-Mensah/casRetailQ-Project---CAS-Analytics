import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  DollarSign,
  Users,
  Truck,
  AlertTriangle,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/sales', icon: ShoppingCart, label: 'Sales' },
  { path: '/inventory', icon: Package, label: 'Inventory' },
  { path: '/expenses', icon: DollarSign, label: 'Expenses' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
  { path: '/customers', icon: Users, label: 'Customers' },
  { path: '/suppliers', icon: Truck, label: 'Suppliers' },
  { path: '/alerts', icon: AlertTriangle, label: 'Alerts' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:inset-0
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">RetailIQ</h1>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                onClick={() => window.innerWidth < 768 && onClose()}
              >
                <Icon size={18} className="mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
