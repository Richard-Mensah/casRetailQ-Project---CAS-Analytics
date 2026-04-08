import React, { useState } from 'react';
import { Plus, Search, Download, TrendingDown, Trash2, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import { Expense } from '../types';

const EXPENSE_CATEGORIES = [
  'Stock Purchase','Rent','Utilities','Staff','Transport',
  'Software','Supplies','Marketing','Equipment','Maintenance','Other'
];

function fmt(n: number) {
  return `GHS ${n.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Expenses() {
  const { expenses, addExpense } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [form, setForm] = useState<Omit<Expense,'id'>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Stock Purchase',
    amount: 0,
  });

  const filtered = expenses.filter(e => {
    const ms = e.description.toLowerCase().includes(search.toLowerCase());
    const mc = !filterCat || e.category === filterCat;
    return ms && mc;
  });

  const totalFiltered = filtered.reduce((a, e) => a + e.amount, 0);

  // Category totals for summary
  const catTotals: Record<string, number> = {};
  filtered.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
  const topCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || form.amount <= 0) return;
    addExpense(form);
    setForm({ date: new Date().toISOString().split('T')[0], description: '', category: 'Stock Purchase', amount: 0 });
    setShowModal(false);
  };

  const handleExport = () => {
    const csv = ['Date,Description,Category,Amount',
      ...filtered.map(e => `${e.date},"${e.description}",${e.category},${e.amount}`)
    ].join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'retailiq-expenses.csv';
    a.click();
  };

  const monthTotal = expenses
    .filter(e => e.date.startsWith(new Date().toISOString().slice(0,7)))
    .reduce((a, e) => a + e.amount, 0);

  const weekTotal = expenses
    .filter(e => e.date >= new Date(Date.now() - 7*86400000).toISOString().split('T')[0])
    .reduce((a, e) => a + e.amount, 0);

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total (filtered)', value: fmt(totalFiltered), color: '#D85A30', bg: '#FAECE7' },
          { label: 'This Week', value: fmt(weekTotal), color: '#BA7517', bg: '#FAEEDA' },
          { label: 'This Month', value: fmt(monthTotal), color: '#D85A30', bg: '#FAECE7' },
          { label: 'No. of Entries', value: filtered.length.toString(), color: '#185FA5', bg: '#E6F1FB' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: bg }}>
                <TrendingDown size={15} style={{ color }} />
              </div>
            </div>
            <div className="text-xl font-bold" style={{ color }}>{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Top categories */}
      {topCats.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Top Expense Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topCats.map(([cat, total], i) => {
              const pct = totalFiltered > 0 ? (total / totalFiltered) * 100 : 0;
              const colors = ['#D85A30','#BA7517','#185FA5','#1D9E75'];
              const bgs = ['#FAECE7','#FAEEDA','#E6F1FB','#E1F5EE'];
              return (
                <div key={cat} className="rounded-xl p-3" style={{ background: bgs[i] }}>
                  <div className="text-sm font-bold" style={{ color: colors[i] }}>{fmt(total)}</div>
                  <div className="text-xs text-gray-600 mt-0.5 truncate">{cat}</div>
                  <div className="w-full bg-white/60 rounded-full h-1 mt-2">
                    <div className="h-1 rounded-full" style={{ width: `${pct}%`, background: colors[i] }} />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{pct.toFixed(0)}% of total</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
            <Search size={15} className="text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search expenses…"
              className="bg-transparent text-sm outline-none flex-1 text-gray-700"
            />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="input-field py-2 text-sm w-full sm:w-44">
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={handleExport} className="btn-secondary py-2 text-sm">
              <Download size={14} /> Export
            </button>
            <button onClick={() => setShowModal(true)} className="btn-primary py-2 text-sm">
              <Plus size={15} /> Add Expense
            </button>
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
                <th className="table-header text-left">Description</th>
                <th className="table-header text-left hidden sm:table-cell">Category</th>
                <th className="table-header text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-400">
                    <TrendingDown size={36} className="mx-auto mb-2 text-gray-200" />
                    <p className="text-sm">No expenses found. Add your first expense!</p>
                  </td>
                </tr>
              ) : filtered.map(e => (
                <tr key={e.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Calendar size={13} className="text-gray-300" />
                      {e.date}
                    </div>
                  </td>
                  <td className="table-cell font-medium text-gray-800">{e.description}</td>
                  <td className="table-cell hidden sm:table-cell">
                    <span className="badge-amber">{e.category}</span>
                  </td>
                  <td className="table-cell text-right font-bold" style={{ color: '#D85A30' }}>
                    {fmt(e.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td colSpan={3} className="table-cell font-bold text-gray-700">Total</td>
                  <td className="table-cell text-right font-bold text-lg" style={{ color: '#D85A30' }}>
                    {fmt(totalFiltered)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Expense">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Description *</label>
            <input
              required
              className="input-field"
              placeholder="e.g. Stock restock – Milo and Beverages"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select className="input-field" value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" className="input-field" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Amount (GHS) *</label>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              className="input-field"
              placeholder="0.00"
              value={form.amount || ''}
              onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
            />
          </div>
          {form.amount > 0 && (
            <div className="rounded-xl p-3 text-center" style={{ background: '#FAECE7' }}>
              <span className="text-sm text-gray-600">Amount: </span>
              <span className="font-bold text-lg" style={{ color: '#D85A30' }}>
                {fmt(form.amount)}
              </span>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)}
              className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center"
              style={{ background: '#D85A30' }}>
              <Plus size={15} /> Add Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
