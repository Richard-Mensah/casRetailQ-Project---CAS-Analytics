import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Expenses from './pages/Expenses';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';

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
