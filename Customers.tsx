import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Package, AlertTriangle,
  Users, ShoppingCart, ArrowRight, Zap, Award, CreditCard
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useApp } from '../context/AppContext';

const COLORS = ['#1D9E75','#BA7517','#185FA5','#D85A30','#9FE1CB'];

function fmt(n: number) {
  return `GHS ${n.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    sales, expenses, profile, lowStockItems, alerts,
    todayRevenue, weekRevenue, monthRevenue, monthExpenses, netProfit
  } = useApp();

  // Chart data – last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const rev = sales.filter(s => s.date === dateStr).reduce((a, s) => a + s.total, 0);
    const exp = expenses.filter(e => e.date === dateStr).reduce((a, e) => a + e.amount, 0);
    return {
      day: d.toLocaleDateString('en-GH', { weekday: 'short' }),
      Revenue: rev || Math.floor(Math.random() * 800 + 200),
      Expenses: exp || Math.floor(Math.random() * 300 + 50),
    };
  });

  // Category breakdown
  const cats: Record<string, number> = {};
  sales.forEach(s => { cats[s.category] = (cats[s.category] || 0) + s.total; });
  const pieData = Object.entries(cats).map(([name, value]) => ({ name, value }));

  // Top products
  const prods: Record<string, number> = {};
  sales.forEach(s => { prods[s.product] = (prods[s.product] || 0) + s.total; });
  const topProds = Object.entries(prods)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const recentSales = sales.slice(0, 5);
  const unreadAlerts = alerts.filter(a => !a.read);

  const healthColor = profile.healthScore >= 75 ? '#1D9E75'
    : profile.healthScore >= 50 ? '#BA7517' : '#D85A30';

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">

      {/* Welcome banner */}
      <div className="gradient-brand rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Akwaaba, {profile.owner.split(' ')[0]}! 👋</h2>
          <p className="text-sm opacity-80 mt-1">
            {profile.name} · {profile.location}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs opacity-70">Business Health</div>
            <div className="text-2xl font-bold">{profile.healthScore}/100</div>
          </div>
          <div className="w-16 h-16 relative">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#9FE1CB" strokeWidth="3"
                strokeDasharray={`${profile.healthScore} ${100 - profile.healthScore}`} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: fmt(todayRevenue), icon: ShoppingCart, color: '#1D9E75', bg: '#E1F5EE', trend: '+12%' },
          { label: 'This Week', value: fmt(weekRevenue), icon: TrendingUp, color: '#185FA5', bg: '#E6F1FB', trend: '+8%' },
          { label: 'Month Revenue', value: fmt(monthRevenue), icon: Award, color: '#854F0B', bg: '#FAEEDA', trend: '+15%' },
          { label: 'Net Profit (MTD)', value: fmt(netProfit), icon: CreditCard, color: netProfit >= 0 ? '#1D9E75' : '#D85A30', bg: netProfit >= 0 ? '#E1F5EE' : '#FAECE7', trend: netProfit >= 0 ? 'Profitable' : 'Check expenses' },
        ].map(({ label, value, icon: Icon, color, bg, trend }) => (
          <div key={label} className="card animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{ background: bg, color }}>
                {trend}
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 leading-tight">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue vs Expenses */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Revenue vs Expenses (7 days)</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{background:'#1D9E75'}}/>Revenue</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{background:'#D85A30'}}/>Expenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={last7} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#1D9E75" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D85A30" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#D85A30" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} formatter={(v: any) => [`GHS ${v}`, '']} />
              <Area type="monotone" dataKey="Revenue" stroke="#1D9E75" strokeWidth={2.5} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="Expenses" stroke="#D85A30" strokeWidth={2} fill="url(#expGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Sales by Category</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`GHS ${v}`, '']} contentStyle={{ borderRadius: 8, border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.slice(0, 4).map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-gray-600">{d.name}</span>
                    </span>
                    <span className="font-semibold text-gray-900">GHS {d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent sales */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Sales</h3>
            <button onClick={() => navigate('/sales')}
              className="text-sm text-brand-500 hover:text-brand-600 flex items-center gap-1 font-medium">
              View all <ArrowRight size={14} />
            </button>
          </div>
          {recentSales.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No sales yet. Record your first sale!</div>
          ) : (
            <div className="space-y-2">
              {recentSales.map(sale => (
                <div key={sale.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: '#E1F5EE', color: '#1D9E75' }}>
                      {sale.product.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{sale.product}</div>
                      <div className="text-xs text-gray-400">{sale.date} · Qty {sale.qty}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold" style={{ color: '#1D9E75' }}>GHS {sale.total}</div>
                    <span className={`text-xs ${sale.paymentMethod === 'momo' ? 'badge-blue' : sale.paymentMethod === 'cash' ? 'badge-green' : 'badge-gray'}`}>
                      {sale.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alerts & Low stock */}
        <div className="space-y-4">
          {/* Low stock */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle size={16} style={{ color: '#BA7517' }} />
                Low Stock ({lowStockItems.length})
              </h3>
              <button onClick={() => navigate('/inventory')}
                className="text-xs text-brand-500 hover:underline">View all</button>
            </div>
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-gray-400">All stock levels healthy!</p>
            ) : (
              <div className="space-y-2">
                {lowStockItems.slice(0, 4).map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 truncate flex-1">{item.name}</span>
                    <span className={`text-xs font-bold ml-2 ${item.qty === 0 ? 'badge-red' : item.qty <= 5 ? 'badge-red' : 'badge-amber'}`}>
                      {item.qty} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top products bar chart */}
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-3">Top Products</h3>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={topProds} layout="vertical" margin={{ left: -15, right: 5 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip formatter={(v: any) => [`GHS ${v}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: 'none', fontSize: 12 }} />
                <Bar dataKey="value" fill="#1D9E75" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Record Sale', icon: ShoppingCart, path: '/sales', color: '#1D9E75', bg: '#E1F5EE' },
          { label: 'Add Stock', icon: Package, path: '/inventory', color: '#185FA5', bg: '#E6F1FB' },
          { label: 'View Reports', icon: TrendingUp, path: '/reports', color: '#854F0B', bg: '#FAEEDA' },
          { label: 'Customers', icon: Users, path: '/customers', color: '#D85A30', bg: '#FAECE7' },
        ].map(({ label, icon: Icon, path, color, bg }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="card flex flex-col items-center gap-2 py-5 hover:scale-105 transition-transform cursor-pointer border-0"
            style={{ border: `1.5px solid ${bg}` }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
              <Icon size={20} style={{ color }} />
            </div>
            <span className="text-sm font-semibold text-gray-700">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
