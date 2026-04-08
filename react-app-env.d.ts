import React, { useState } from 'react';
import { Plus, Search, Filter, Download, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { Sale } from '../types';

const categories = ['Beverages','Grains','Staples','Cooking','Proteins','Household','Other'];
const paymentMethods = ['cash','momo','card','credit'];

function fmt(n: number) { return `GHS ${n.toLocaleString('en-GH',{minimumFractionDigits:2,maximumFractionDigits:2})}`; }

export default function Sales() {
  const { sales, addSale, monthRevenue } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterPay, setFilterPay] = useState('');
  const [form, setForm] = useState({
    product:'', category:'Beverages', qty:1, unitPrice:0,
    paymentMethod:'cash' as Sale['paymentMethod'], customer:'', date: new Date().toISOString().split('T')[0]
  });

  const filtered = sales.filter(s => {
    const matchSearch = s.product.toLowerCase().includes(search.toLowerCase()) ||
      (s.customer || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || s.category === filterCat;
    const matchPay = !filterPay || s.paymentMethod === filterPay;
    return matchSearch && matchCat && matchPay;
  });

  const total = filtered.reduce((a, s) => a + s.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product || form.qty <= 0 || form.unitPrice <= 0) return;
    addSale({ ...form, total: form.qty * form.unitPrice });
    setForm({ product:'', category:'Beverages', qty:1, unitPrice:0, paymentMethod:'cash', customer:'', date:new Date().toISOString().split('T')[0] });
    setShowModal(false);
  };

  const handleExport = () => {
    const csv = ['Date,Product,Category,Qty,Unit Price,Total,Payment,Customer',
      ...filtered.map(s => `${s.date},${s.product},${s.category},${s.qty},${s.unitPrice},${s.total},${s.paymentMethod},${s.customer||''}`)
    ].join('\n');
    const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'retailiq-sales.csv'; a.click();
  };

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Total Sales (filtered)', value: fmt(total), icon: TrendingUp, color:'#1D9E75', bg:'#E1F5EE' },
          { label:'No. of Transactions', value: filtered.length.toString(), icon: TrendingUp, color:'#185FA5', bg:'#E6F1FB' },
          { label:'Month Revenue', value: fmt(monthRevenue), icon: TrendingUp, color:'#854F0B', bg:'#FAEEDA' },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className="card flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div><div className="font-bold text-lg text-gray-900">{value}</div><div className="text-xs text-gray-500">{label}</div></div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
            <Search size={15} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search product or customer…" className="bg-transparent text-sm outline-none flex-1 text-gray-700" />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="input-field py-2 text-sm w-full sm:w-40">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterPay} onChange={e => setFilterPay(e.target.value)} className="input-field py-2 text-sm w-full sm:w-36">
            <option value="">All Payments</option>
            {paymentMethods.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={handleExport} className="btn-secondary py-2 text-sm"><Download size={14}/>Export</button>
            <button onClick={() => setShowModal(true)} className="btn-primary py-2 text-sm"><Plus size={15}/>Record Sale</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="table-header text-left">Date</th>
                <th className="table-header text-left">Product</th>
                <th className="table-header text-left hidden sm:table-cell">Category</th>
                <th className="table-header text-right">Qty</th>
                <th className="table-header text-right">Unit Price</th>
                <th className="table-header text-right">Total</th>
                <th className="table-header text-center">Payment</th>
                <th className="table-header text-left hidden lg:table-cell">Customer</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">
                  No sales found. Record your first sale!
                </td></tr>
              ) : filtered.map(s => (
                <tr key={s.id} className="table-row">
                  <td className="table-cell text-gray-500">{s.date}</td>
                  <td className="table-cell font-semibold text-gray-900">{s.product}</td>
                  <td className="table-cell hidden sm:table-cell"><span className="badge-gray">{s.category}</span></td>
                  <td className="table-cell text-right text-gray-700">{s.qty}</td>
                  <td className="table-cell text-right text-gray-700">GHS {s.unitPrice}</td>
                  <td className="table-cell text-right font-bold" style={{ color:'#1D9E75' }}>GHS {s.total}</td>
                  <td className="table-cell text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      s.paymentMethod==='momo'?'badge-blue':
                      s.paymentMethod==='cash'?'badge-green':
                      s.paymentMethod==='card'?'badge-gray':'badge-amber'
                    }`}>{s.paymentMethod.toUpperCase()}</span>
                  </td>
                  <td className="table-cell text-gray-500 hidden lg:table-cell">{s.customer || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Record New Sale">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Product Name *</label>
              <input required className="input-field" placeholder="e.g. Milo 500g"
                value={form.product} onChange={e => setForm({...form,product:e.target.value})} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" className="input-field" value={form.date} onChange={e => setForm({...form,date:e.target.value})} />
            </div>
            <div>
              <label className="label">Quantity *</label>
              <input required type="number" min="1" className="input-field"
                value={form.qty} onChange={e => setForm({...form,qty:Number(e.target.value)})} />
            </div>
            <div>
              <label className="label">Unit Price (GHS) *</label>
              <input required type="number" min="0.01" step="0.01" className="input-field"
                value={form.unitPrice} onChange={e => setForm({...form,unitPrice:Number(e.target.value)})} />
            </div>
            <div>
              <label className="label">Payment Method</label>
              <select className="input-field" value={form.paymentMethod} onChange={e => setForm({...form,paymentMethod:e.target.value as Sale['paymentMethod']})}>
                {paymentMethods.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Customer (optional)</label>
              <input className="input-field" placeholder="Customer name"
                value={form.customer} onChange={e => setForm({...form,customer:e.target.value})} />
            </div>
          </div>
          {form.qty > 0 && form.unitPrice > 0 && (
            <div className="rounded-xl p-3 text-center" style={{ background:'#E1F5EE' }}>
              <span className="text-sm text-gray-600">Total: </span>
              <span className="font-bold text-lg" style={{ color:'#1D9E75' }}>
                GHS {(form.qty * form.unitPrice).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Record Sale</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
