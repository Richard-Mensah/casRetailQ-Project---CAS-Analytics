import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, AlertTriangle, Package } from 'lucide-react';
import { useApp } from './AppContext';
import Modal from './Modal';
import { InventoryItem } from './types';

const categories = ['Beverages','Grains','Staples','Cooking','Proteins','Household','Other'];

export default function Inventory() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, lowStockItems } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const blank: Omit<InventoryItem,'id'> = {
    name:'', category:'Beverages', sku:'', qty:0, reorderLevel:10,
    costPrice:0, sellingPrice:0, supplier:'', lastRestocked: new Date().toISOString().split('T')[0]
  };
  const [form, setForm] = useState<Omit<InventoryItem,'id'>>(blank);

  const filtered = inventory.filter(i => {
    const ms = i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
    const mc = !filterCat || i.category === filterCat;
    const low = i.qty <= i.reorderLevel;
    const mst = !filterStatus || (filterStatus==='low'&&low) || (filterStatus==='ok'&&!low) || (filterStatus==='out'&&i.qty===0);
    return ms && mc && mst;
  });

  const totalValue = inventory.reduce((a, i) => a + i.qty * i.costPrice, 0);
  const totalItems = inventory.reduce((a, i) => a + i.qty, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem(form);
    setForm(blank); setShowAdd(false);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItem) { updateInventoryItem(editItem.id, form); setEditItem(null); }
  };

  const openEdit = (item: InventoryItem) => {
    setEditItem(item);
    setForm({ name:item.name, category:item.category, sku:item.sku, qty:item.qty,
      reorderLevel:item.reorderLevel, costPrice:item.costPrice, sellingPrice:item.sellingPrice,
      supplier:item.supplier||'', lastRestocked:item.lastRestocked||'' });
  };

  const statusBadge = (item: InventoryItem) => {
    if (item.qty === 0) return <span className="badge-red">Out of Stock</span>;
    if (item.qty <= item.reorderLevel) return <span className="badge-amber">Low Stock</span>;
    return <span className="badge-green">In Stock</span>;
  };

  const margin = (i: InventoryItem) => i.costPrice > 0
    ? (((i.sellingPrice - i.costPrice) / i.costPrice) * 100).toFixed(0) + '%' : '—';

  const FormFields = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="label">Product Name *</label>
        <input required className="input-field" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Milo 500g"/>
      </div>
      <div>
        <label className="label">SKU</label>
        <input className="input-field" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} placeholder="BEV-001"/>
      </div>
      <div>
        <label className="label">Category</label>
        <select className="input-field" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
          {categories.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Quantity in Stock</label>
        <input type="number" min="0" className="input-field" value={form.qty} onChange={e=>setForm({...form,qty:Number(e.target.value)})}/>
      </div>
      <div>
        <label className="label">Reorder Level</label>
        <input type="number" min="0" className="input-field" value={form.reorderLevel} onChange={e=>setForm({...form,reorderLevel:Number(e.target.value)})}/>
      </div>
      <div>
        <label className="label">Cost Price (GHS)</label>
        <input type="number" min="0" step="0.01" className="input-field" value={form.costPrice} onChange={e=>setForm({...form,costPrice:Number(e.target.value)})}/>
      </div>
      <div>
        <label className="label">Selling Price (GHS)</label>
        <input type="number" min="0" step="0.01" className="input-field" value={form.sellingPrice} onChange={e=>setForm({...form,sellingPrice:Number(e.target.value)})}/>
      </div>
      <div>
        <label className="label">Supplier</label>
        <input className="input-field" value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})} placeholder="Supplier name"/>
      </div>
      <div>
        <label className="label">Last Restocked</label>
        <input type="date" className="input-field" value={form.lastRestocked} onChange={e=>setForm({...form,lastRestocked:e.target.value})}/>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {label:'Total Items (SKUs)',value:inventory.length.toString(),color:'#185FA5',bg:'#E6F1FB'},
          {label:'Units in Stock',value:totalItems.toLocaleString(),color:'#1D9E75',bg:'#E1F5EE'},
          {label:'Stock Value',value:`GHS ${totalValue.toLocaleString('en-GH',{maximumFractionDigits:0})}`,color:'#854F0B',bg:'#FAEEDA'},
          {label:'Low Stock Alerts',value:lowStockItems.length.toString(),color:'#D85A30',bg:'#FAECE7'},
        ].map(({label,value,color,bg})=>(
          <div key={label} className="card p-4">
            <div className="text-xl font-bold" style={{color}}>{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Low stock warning */}
      {lowStockItems.length > 0 && (
        <div className="rounded-xl p-4 flex items-start gap-3" style={{background:'#FAEEDA',border:'1px solid #FAC775'}}>
          <AlertTriangle size={18} style={{color:'#BA7517',flexShrink:0,marginTop:1}}/>
          <div>
            <div className="font-semibold text-sm" style={{color:'#854F0B'}}>
              {lowStockItems.length} item{lowStockItems.length>1?'s':''} need restocking
            </div>
            <div className="text-xs mt-1" style={{color:'#854F0B'}}>
              {lowStockItems.slice(0,3).map(i=>i.name).join(', ')}{lowStockItems.length>3?` and ${lowStockItems.length-3} more`:''}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
            <Search size={15} className="text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search product or SKU…"
              className="bg-transparent text-sm outline-none flex-1"/>
          </div>
          <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} className="input-field py-2 text-sm w-full sm:w-40">
            <option value="">All Categories</option>
            {categories.map(c=><option key={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="input-field py-2 text-sm w-full sm:w-36">
            <option value="">All Status</option>
            <option value="ok">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <button onClick={()=>{setForm(blank);setShowAdd(true);}} className="btn-primary py-2 text-sm">
            <Plus size={15}/>Add Item
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="table-header text-left">Product</th>
                <th className="table-header text-left hidden sm:table-cell">SKU</th>
                <th className="table-header text-left hidden md:table-cell">Category</th>
                <th className="table-header text-right">Stock</th>
                <th className="table-header text-right hidden lg:table-cell">Cost</th>
                <th className="table-header text-right hidden lg:table-cell">Price</th>
                <th className="table-header text-right hidden lg:table-cell">Margin</th>
                <th className="table-header text-center">Status</th>
                <th className="table-header text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length===0?(
                <tr><td colSpan={9} className="text-center py-12 text-gray-400 text-sm">
                  <Package size={32} className="mx-auto mb-2 text-gray-300"/>
                  No items found. Add your first product!
                </td></tr>
              ):filtered.map(item=>(
                <tr key={item.id} className="table-row">
                  <td className="table-cell">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.supplier}</div>
                  </td>
                  <td className="table-cell text-gray-500 hidden sm:table-cell font-mono text-xs">{item.sku}</td>
                  <td className="table-cell hidden md:table-cell"><span className="badge-gray">{item.category}</span></td>
                  <td className="table-cell text-right">
                    <span className={`font-bold ${item.qty<=item.reorderLevel?'text-red-500':'text-gray-900'}`}>{item.qty}</span>
                    <span className="text-xs text-gray-400 ml-1">/ {item.reorderLevel}</span>
                  </td>
                  <td className="table-cell text-right hidden lg:table-cell text-gray-600">GHS {item.costPrice}</td>
                  <td className="table-cell text-right hidden lg:table-cell font-semibold" style={{color:'#1D9E75'}}>GHS {item.sellingPrice}</td>
                  <td className="table-cell text-right hidden lg:table-cell">
                    <span className="badge-green">{margin(item)}</span>
                  </td>
                  <td className="table-cell text-center">{statusBadge(item)}</td>
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={()=>openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                        <Edit2 size={14}/>
                      </button>
                      <button onClick={()=>deleteInventoryItem(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Inventory Item">
        <form onSubmit={handleAdd} className="space-y-4">
          <FormFields/>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={()=>setShowAdd(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Add Item</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editItem} onClose={()=>setEditItem(null)} title="Edit Inventory Item">
        <form onSubmit={handleEdit} className="space-y-4">
          <FormFields/>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={()=>setEditItem(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center">Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
