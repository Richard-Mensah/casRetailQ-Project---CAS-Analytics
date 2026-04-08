import React, { useState } from 'react';
import { Plus, Search, Users, Star, Phone, Mail, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { Customer } from '../types';

function fmt(n: number) {
  return `GHS ${n.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Customers() {
  const { customers, addCustomer, sales } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);

  const [form, setForm] = useState({ name: '', phone: '', email: '' });

  const filtered = customers.filter(c => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const mst = !filterStatus || c.status === filterStatus;
    return ms && mst;
  });

  const totalRevFromCustomers = customers.reduce((a, c) => a + c.totalPurchases, 0);
  const vipCount = customers.filter(c => c.status === 'vip').length;
  const activeCount = customers.filter(c => c.status === 'active').length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    addCustomer({
      ...form,
      totalPurchases: 0,
      lastVisit: new Date().toISOString().split('T')[0],
      loyaltyPoints: 0,
      status: 'active',
    });
    setForm({ name: '', phone: '', email: '' });
    setShowModal(false);
  };

  const customerSales = selected
    ? sales.filter(s => s.customer === selected.name)
    : [];

  const statusBadge = (status: Customer['status']) => {
    if (status === 'vip') return <span className="badge-amber">⭐ VIP</span>;
    if (status === 'active') return <span className="badge-green">Active</span>;
    return <span className="badge-gray">Inactive</span>;
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length.toString(), color: '#185FA5', bg: '#E6F1FB' },
          { label: 'VIP Customers', value: vipCount.toString(), color: '#854F0B', bg: '#FAEEDA' },
          { label: 'Active Customers', value: activeCount.toString(), color: '#1D9E75', bg: '#E1F5EE' },
          { label: 'Total Customer Revenue', value: fmt(totalRevFromCustomers), color: '#1D9E75', bg: '#E1F5EE' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="card p-4">
            <div className="text-xl font-bold" style={{ color }}>{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
            <Search size={15} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name or phone…"
              className="bg-transparent text-sm outline-none flex-1 text-gray-700" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="input-field py-2 text-sm w-full sm:w-40">
            <option value="">All Status</option>
            <option value="vip">VIP</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button onClick={() => setShowModal(true)} className="btn-primary py-2 text-sm">
            <Plus size={15} /> Add Customer
          </button>
        </div>
      </div>

      {/* Customer grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Users size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm">No customers found. Add your first customer!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id}
              onClick={() => setSelected(c)}
              className="card cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-white"
                    style={{ background: c.status === 'vip' ? '#854F0B' : '#1D9E75' }}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{c.name}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone size={10} /> {c.phone}
                    </div>
                  </div>
                </div>
                {statusBadge(c.status)}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-50">
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900">GHS {c.totalPurchases}</div>
                  <div className="text-xs text-gray-400">Spent</div>
                </div>
                <div className="text-center border-x border-gray-100">
                  <div className="text-sm font-bold" style={{ color: '#854F0B' }}>{c.loyaltyPoints}</div>
                  <div className="text-xs text-gray-400">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600">{c.lastVisit}</div>
                  <div className="text-xs text-gray-400">Last visit</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Customer">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Full Name *</label>
            <input required className="input-field" placeholder="e.g. Ama Owusu"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone Number *</label>
            <input required className="input-field" placeholder="0244-XXXXXX"
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Email (optional)</label>
            <input type="email" className="input-field" placeholder="customer@email.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Add Customer</button>
          </div>
        </form>
      </Modal>

      {/* Customer detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''} size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                style={{ background: selected.status === 'vip' ? '#854F0B' : '#1D9E75' }}>
                {selected.name.charAt(0)}
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{selected.name}</div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Phone size={12} />{selected.phone}</span>
                  {selected.email && <span className="flex items-center gap-1"><Mail size={12} />{selected.email}</span>}
                </div>
                <div className="mt-1">{statusBadge(selected.status)}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Spent', value: fmt(selected.totalPurchases), color: '#1D9E75' },
                { label: 'Loyalty Points', value: selected.loyaltyPoints.toString(), color: '#854F0B' },
                { label: 'Transactions', value: customerSales.length.toString(), color: '#185FA5' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ background: '#f8faf9', border: '1px solid #f0f0f0' }}>
                  <div className="text-lg font-bold" style={{ color }}>{value}</div>
                  <div className="text-xs text-gray-500">{label}</div>
                </div>
              ))}
            </div>

            {customerSales.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp size={15} style={{ color: '#1D9E75' }} />
                  Purchase History
                </h4>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {customerSales.map(s => (
                    <div key={s.id} className="flex justify-between items-center py-2 border-b border-gray-50">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{s.product}</div>
                        <div className="text-xs text-gray-400">{s.date} · Qty {s.qty}</div>
                      </div>
                      <div className="font-bold text-sm" style={{ color: '#1D9E75' }}>GHS {s.total}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setSelected(null)} className="btn-secondary w-full justify-center">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
