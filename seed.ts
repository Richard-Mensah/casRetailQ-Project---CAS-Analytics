import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Package, TrendingUp,
  TrendingDown, Users, Truck, Bell, Settings, LogOut, Zap, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { path: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/sales',      icon: ShoppingCart,    label: 'Sales' },
  { path: '/inventory',  icon: Package,         label: 'Inventory' },
  { path: '/expenses',   icon: TrendingDown,    label: 'Expenses' },
  { path: '/reports',    icon: TrendingUp,      label: 'Reports & P&L' },
  { path: '/customers',  icon: Users,           label: 'Customers' },
  { path: '/suppliers',  icon: Truck,           label: 'Suppliers' },
  { path: '/alerts',     icon: Bell,            label: 'Alerts' },
  { path: '/settings',   icon: Settings,        label: 'Settings' },
];

interface SidebarProps { open: boolean; onClose: () => void; }

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, unreadAlerts, lowStockItems } = useApp();

  const handleNav = (path: string) => { navigate(path); onClose(); };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-64 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'linear-gradient(180deg,#0F4C35 0%,#0a3226 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-base leading-tight">RetailIQ</div>
              <div className="text-xs" style={{ color: '#9FE1CB' }}>Adwuma Pa · CAS</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>

        {/* Business info */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: '#1D9E75', color: '#fff' }}>
              {profile.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-semibold truncate">{profile.name}</div>
              <div className="text-xs truncate" style={{ color: '#9FE1CB' }}>{profile.location}</div>
            </div>
          </div>
          {/* Health Score mini */}
          <div className="mt-3 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs" style={{ color: '#9FE1CB' }}>Business Health</span>
              <span className="text-sm font-bold text-white">{profile.healthScore}/100</span>
            </div>
            <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <div className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${profile.healthScore}%`, background: '#9FE1CB' }} />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          <div className="space-y-0.5">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              const badge = path === '/alerts' ? unreadAlerts
                : path === '/inventory' ? lowStockItems.length : 0;
              return (
                <button
                  key={path}
                  onClick={() => handleNav(path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                  style={{
                    background: isActive ? '#1D9E75' : 'transparent',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)';
                  }}
                >
                  <Icon size={17} />
                  <span className="flex-1 text-left">{label}</span>
                  {badge > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: path === '/inventory' ? '#BA7517' : '#E53935', color: '#fff' }}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Version + sign out */}
        <div className="px-3 pb-4 pt-2 border-t border-white/10">
          <div className="text-center text-xs mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
            RetailIQ v1.0 · CAS 2026
          </div>
          <button
            onClick={() => handleNav('/settings')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; }}
          >
            <LogOut size={15} />
            <span>Settings & Profile</span>
          </button>
        </div>
      </aside>
    </>
  );
}
