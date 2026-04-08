import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Dashboard from './Dashboard';
import Sales from './Sales';
import Inventory from './Inventory';
import Reports from './Reports';
import Expenses from './Expenses';
import Customers from './Customers';
import Suppliers from './Suppliers';
import Alerts from './Alerts';
import Settings from './Settings';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f8faf9' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/sales"      element={<Sales />} />
            <Route path="/inventory"  element={<Inventory />} />
            <Route path="/expenses"   element={<Expenses />} />
            <Route path="/reports"    element={<Reports />} />
            <Route path="/customers"  element={<Customers />} />
            <Route path="/suppliers"  element={<Suppliers />} />
            <Route path="/alerts"     element={<Alerts />} />
            <Route path="/settings"   element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AppProvider>
  );
}
