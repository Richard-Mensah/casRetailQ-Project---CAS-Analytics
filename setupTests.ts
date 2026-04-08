import React, { useState } from 'react';
import { Plus, Search, Phone, Mail, Star, Truck, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { Supplier } from '../types';

const categories = ['Beverages', 'Grains', 'Staples', 'Cooking', 'Proteins', 'Household', 'Other'];

export default function Suppliers() {
  const { suppliers, addSupplier } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [form, setForm] = useState<Omit<Supplier, 'id'>>({
    name: '', contact: '', phone: '', email: '', category: 'Beverages',
    status: 'active', totalOrders: 0, rating: 4.0,
  });

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    addSupplier(form);
    setForm({ name: '', contact: '', phone: '', email: '', category: 'Beverages', status: 'active', totalOrders: 0, rating: 4.0 });
    setShowModal(false);
  };

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12}
          fill={i <= Math.round(rating) ? '#BA7517' : 'none'}
          stroke={i <= Math.round(rating) ? '#BA7517' : '#d1d5db'} />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Suppliers', value: suppliers.length.toString(), color: '#185FA5', bg: '#E6F1FB' },
          { label: 'Active', value: suppliers.filter(s => s.status === 'active').length.toString(), color: '#1D9E75', bg: '#E1F5EE' },
          { label: 'Total Orders Placed', value: suppliers.reduce((a, s) => a + s.totalOrders, 0).toString(), color: '#854F0B', bg: '#FAEEDA' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="card p-4">
            <div className="text-2xl font-bold" style={{ color }}>{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
          <Search size={15} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search suppliers…"
            className="bg-transparent text-sm outline-none flex-1 text-gray-700" />
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary py-2 text-sm">
          <Plus size={15} /> Add Supplier
        </button>
      </div>

      {/* Supplier cards */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Truck size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-sm">No suppliers yet. Add your first supplier!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s.id}
              onClick={() => setSelected(s)}
              className="card cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-gray-900">{s.name}</div>
                  <span className="badge-blue mt-1">{s.category}</span>
                </div>
                <span className={s.status === 'active' ? 'badge-green' : 'badge-gray'}>
                  {s.status}
                </span>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-gray-400" />
                  {s.phone}
                </div>
                {s.contact && (
                  <div className="text-xs text-gray-400">Contact: {s.contact}</div>
                )}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                <RatingStars rating={s.rating} />
                <span className="text-xs text-gray-500">{s.totalOrders} orders</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Supplier">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Company Name *</label>
            <input required className="input-field" placeholder="e.g. Nestle Ghana Ltd"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Contact Person</label>
              <input className="input-field" placeholder="Contact name"
                value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone *</label>
              <input required className="input-field" placeholder="0244-XXXXXX"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input-field" placeholder="email@supplier.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input-field" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Add Supplier</button>
          </div>
        </form>
      </Modal>

      {/* Supplier detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Supplier Details">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                style={{ background: '#185FA5' }}>
                {selected.name.charAt(0)}
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">{selected.name}</div>
                <span className="badge-blue">{selected.category}</span>
              </div>
            </div>
            <div className="space-y-3 rounded-xl p-4" style={{ background: '#f8faf9' }}>
              {[
                { icon: Phone, label: 'Phone', value: selected.phone },
                { icon: Mail, label: 'Email', value: selected.email || 'Not provided' },
                { icon: Truck, label: 'Contact', value: selected.contact || 'Not provided' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <Icon size={15} className="text-gray-400" />
                  <span className="text-gray-500 w-16">{label}:</span>
                  <span className="text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3 text-center" style={{ background: '#E1F5EE' }}>
                <div className="text-xl font-bold" style={{ color: '#1D9E75' }}>{selected.totalOrders}</div>
                <div className="text-xs text-gray-500">Total Orders</div>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: '#FAEEDA' }}>
                <div className="text-xl font-bold" style={{ color: '#854F0B' }}>{selected.rating}/5.0</div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="btn-secondary w-full justify-center">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
