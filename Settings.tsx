import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useApp } from '../context/AppContext';

const COLORS = ['#1D9E75','#185FA5','#BA7517','#D85A30','#9FE1CB','#9b5de5'];

function fmt(n: number) {
  return `GHS ${n.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Reports() {
  const { sales, expenses, inventory } = useApp();
  const [period, setPeriod] = useState<'week'|'month'|'all'>('month');

  const now = new Date();
  const filterDate = period === 'week'
    ? new Date(Date.now() - 7*86400000).toISOString().split('T')[0]
    : period === 'month'
    ? `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`
    : '2000-01-01';

  const fSales = sales.filter(s => s.date >= filterDate);
  const fExp   = expenses.filter(e => e.date >= filterDate);

  const totalRev  = fSales.reduce((a, s) => a + s.total, 0);
  const totalExp  = fExp.reduce((a, e) => a + e.amount, 0);
  const grossProfit = fSales.reduce((a, s) => {
    const inv = inventory.find(i => i.name === s.product);
    const cost = inv ? inv.costPrice * s.qty : 0;
    return a + (s.total - cost);
  }, 0);
  const netProfit = totalRev - totalExp;
  const margin = totalRev > 0 ? ((netProfit / totalRev) * 100).toFixed(1) : '0.0';

  // Daily chart
  const days = period === 'week' ? 7 : 10;
  const dailyData = Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86400000);
    const ds = d.toISOString().split('T')[0];
    const rev = fSales.filter(s => s.date === ds).reduce((a, s) => a + s.total, 0);
    const exp = fExp.filter(e => e.date === ds).reduce((a, e) => a + e.amount, 0);
    return { day: d.toLocaleDateString('en-GH', { month:'short', day:'numeric' }), Revenue: rev, Expenses: exp, Profit: Math.max(0, rev - exp) };
  });

  // Category revenue
  const catData: Record<string, number> = {};
  fSales.forEach(s => { catData[s.category] = (catData[s.category] || 0) + s.total; });
  const catChart = Object.entries(catData).map(([name, value]) => ({ name, value })).sort((a,b)=>b.value-a.value);

  // Expense categories
  const expCat: Record<string, number> = {};
  fExp.forEach(e => { expCat[e.category] = (expCat[e.category] || 0) + e.amount; });
  const expChart = Object.entries(expCat).map(([name, value]) => ({ name, value }));

  // Payment methods
  const payData: Record<string, number> = {};
  fSales.forEach(s => { payData[s.paymentMethod] = (payData[s.paymentMethod] || 0) + s.total; });
  const payChart = Object.entries(payData).map(([name, value]) => ({ name: name.toUpperCase(), value }));

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Period:</span>
        {(['week','month','all'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${period===p?'text-white shadow-sm':'text-gray-600 hover:bg-gray-100'}`}
            style={period===p?{background:'#1D9E75'}:{}}>
            {p === 'week' ? 'Last 7 Days' : p === 'month' ? 'This Month' : 'All Time'}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Total Revenue', value:fmt(totalRev), color:'#1D9E75', bg:'#E1F5EE', icon:TrendingUp },
          { label:'Total Expenses', value:fmt(totalExp), color:'#D85A30', bg:'#FAECE7', icon:TrendingDown },
          { label:'Gross Profit', value:fmt(grossProfit), color:'#185FA5', bg:'#E6F1FB', icon:DollarSign },
          { label:'Net Profit ('+ margin +'%)', value:fmt(netProfit), color:netProfit>=0?'#1D9E75':'#D85A30', bg:netProfit>=0?'#E1F5EE':'#FAECE7', icon:BarChart2 },
        ].map(({label,value,color,bg,icon:Icon})=>(
          <div key={label} className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:bg}}>
                <Icon size={16} style={{color}}/>
              </div>
            </div>
            <div className="text-xl font-bold" style={{color}}>{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* P&L summary box */}
      <div className="card" style={{border:'1.5px solid #9FE1CB'}}>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart2 size={18} style={{color:'#1D9E75'}}/>
          Profit & Loss Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {label:'Revenue',value:totalRev,color:'#1D9E75'},
            {label:'Less: Expenses',value:-totalExp,color:'#D85A30'},
            {label:'Net Profit/Loss',value:netProfit,color:netProfit>=0?'#1D9E75':'#D85A30',bold:true},
          ].map(({label,value,color,bold})=>(
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 sm:flex-col sm:items-start sm:border-b-0">
              <span className="text-sm text-gray-600">{label}</span>
              <span className={`font-${bold?'bold':'semibold'} text-${bold?'lg':'base'}`} style={{color}}>
                {value<0?'– ':''}{fmt(Math.abs(value))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Daily trend */}
        <div className="card lg:col-span-2">
          <h3 className="font-bold text-gray-900 mb-4">Daily Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyData} margin={{left:-10,right:5}}>
              <XAxis dataKey="day" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:10,border:'none',boxShadow:'0 4px 20px rgba(0,0,0,.1)'}} formatter={(v:any)=>[`GHS ${v}`,'']}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <Bar dataKey="Revenue" fill="#1D9E75" radius={[4,4,0,0]}/>
              <Bar dataKey="Expenses" fill="#D85A30" radius={[4,4,0,0]}/>
              <Bar dataKey="Profit" fill="#9FE1CB" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by category */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Revenue by Category</h3>
          {catChart.length>0?(
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={catChart} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,percent})=>`${name} ${((percent||0)*100).toFixed(0)}%`} labelLine={false}>
                  {catChart.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie>
                <Tooltip formatter={(v:any)=>[`GHS ${v}`,'']} contentStyle={{borderRadius:8,border:'none'}}/>
              </PieChart>
            </ResponsiveContainer>
          ):<div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data</div>}
        </div>

        {/* Expenses by category */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Expenses by Category</h3>
          {expChart.length>0?(
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={expChart} layout="vertical" margin={{left:-10}}>
                <XAxis type="number" tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="name" tick={{fontSize:11,fill:'#6b7280'}} axisLine={false} tickLine={false} width={90}/>
                <Tooltip formatter={(v:any)=>[`GHS ${v}`,'Amount']} contentStyle={{borderRadius:8,border:'none',fontSize:12}}/>
                <Bar dataKey="value" fill="#D85A30" radius={[0,4,4,0]}/>
              </BarChart>
            </ResponsiveContainer>
          ):<div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data</div>}
        </div>

        {/* Payment methods */}
        <div className="card lg:col-span-2">
          <h3 className="font-bold text-gray-900 mb-4">Revenue by Payment Method</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {payChart.map(({name,value},i)=>(
              <div key={name} className="rounded-xl p-4 text-center" style={{background:i===0?'#E1F5EE':i===1?'#E6F1FB':i===2?'#FAEEDA':'#F1EFE8'}}>
                <div className="text-2xl font-bold mb-1" style={{color:COLORS[i%COLORS.length]}}>GHS {value.toLocaleString()}</div>
                <div className="text-sm font-semibold text-gray-700">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expenses list */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4">Expense Log</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="table-header text-left">Date</th>
                <th className="table-header text-left">Description</th>
                <th className="table-header text-left hidden sm:table-cell">Category</th>
                <th className="table-header text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {fExp.length===0?(
                <tr><td colSpan={4} className="text-center py-8 text-gray-400 text-sm">No expenses recorded</td></tr>
              ):fExp.map(e=>(
                <tr key={e.id} className="table-row">
                  <td className="table-cell text-gray-500">{e.date}</td>
                  <td className="table-cell text-gray-800">{e.description}</td>
                  <td className="table-cell hidden sm:table-cell"><span className="badge-gray">{e.category}</span></td>
                  <td className="table-cell text-right font-semibold" style={{color:'#D85A30'}}>GHS {e.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
