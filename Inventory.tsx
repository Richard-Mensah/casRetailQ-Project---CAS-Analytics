import { Sale, Expense, InventoryItem, Supplier, Customer, Alert } from '../types';

export const seedSales: Sale[] = [
  { id:'s1', date:'2024-04-01', product:'Milo 500g', category:'Beverages', qty:12, unitPrice:18, total:216, paymentMethod:'momo', customer:'Ama Owusu' },
  { id:'s2', date:'2024-04-01', product:'Rice 5kg', category:'Grains', qty:5, unitPrice:65, total:325, paymentMethod:'cash', customer:'Kofi Boateng' },
  { id:'s3', date:'2024-04-02', product:'Nescafe 200g', category:'Beverages', qty:8, unitPrice:22, total:176, paymentMethod:'cash' },
  { id:'s4', date:'2024-04-02', product:'Cooking Oil 2L', category:'Cooking', qty:6, unitPrice:45, total:270, paymentMethod:'momo', customer:'Abena Mensah' },
  { id:'s5', date:'2024-04-03', product:'Sugar 1kg', category:'Staples', qty:20, unitPrice:12, total:240, paymentMethod:'cash' },
  { id:'s6', date:'2024-04-03', product:'Milo 500g', category:'Beverages', qty:7, unitPrice:18, total:126, paymentMethod:'card', customer:'Yaw Asante' },
  { id:'s7', date:'2024-04-04', product:'Flour 2kg', category:'Staples', qty:10, unitPrice:28, total:280, paymentMethod:'cash', customer:'Efua Darko' },
  { id:'s8', date:'2024-04-04', product:'Tomato Paste', category:'Cooking', qty:15, unitPrice:8, total:120, paymentMethod:'momo' },
  { id:'s9', date:'2024-04-05', product:'Rice 5kg', category:'Grains', qty:8, unitPrice:65, total:520, paymentMethod:'cash', customer:'Kwame Acheampong' },
  { id:'s10', date:'2024-04-05', product:'Sardines 155g', category:'Proteins', qty:24, unitPrice:7, total:168, paymentMethod:'cash' },
  { id:'s11', date:'2024-04-06', product:'Milk Powder 400g', category:'Beverages', qty:6, unitPrice:35, total:210, paymentMethod:'momo', customer:'Ama Owusu' },
  { id:'s12', date:'2024-04-06', product:'Maize 5kg', category:'Grains', qty:12, unitPrice:40, total:480, paymentMethod:'cash', customer:'Akosua Frimpong' },
  { id:'s13', date:'2024-04-07', product:'Cooking Oil 2L', category:'Cooking', qty:9, unitPrice:45, total:405, paymentMethod:'card' },
  { id:'s14', date:'2024-04-07', product:'Sugar 1kg', category:'Staples', qty:18, unitPrice:12, total:216, paymentMethod:'cash' },
  { id:'s15', date:'2024-04-08', product:'Milo 500g', category:'Beverages', qty:14, unitPrice:18, total:252, paymentMethod:'momo', customer:'Kofi Boateng' },
  { id:'s16', date:'2024-04-08', product:'Tomato Paste', category:'Cooking', qty:30, unitPrice:8, total:240, paymentMethod:'cash' },
  { id:'s17', date:'2024-04-09', product:'Rice 5kg', category:'Grains', qty:6, unitPrice:65, total:390, paymentMethod:'momo' },
  { id:'s18', date:'2024-04-09', product:'Flour 2kg', category:'Staples', qty:8, unitPrice:28, total:224, paymentMethod:'cash', customer:'Yaw Asante' },
  { id:'s19', date:'2024-04-10', product:'Sardines 155g', category:'Proteins', qty:36, unitPrice:7, total:252, paymentMethod:'cash' },
  { id:'s20', date:'2024-04-10', product:'Nescafe 200g', category:'Beverages', qty:5, unitPrice:22, total:110, paymentMethod:'card', customer:'Abena Mensah' },
];

export const seedExpenses: Expense[] = [
  { id:'e1', date:'2024-04-01', description:'Stock restock – Milo and Beverages', category:'Stock Purchase', amount:1200 },
  { id:'e2', date:'2024-04-02', description:'Shop rent – April', category:'Rent', amount:800 },
  { id:'e3', date:'2024-04-03', description:'Electricity bill', category:'Utilities', amount:120 },
  { id:'e4', date:'2024-04-04', description:'Rice and Grains restock', category:'Stock Purchase', amount:2100 },
  { id:'e5', date:'2024-04-05', description:'Transport – delivery from distributor', category:'Transport', amount:85 },
  { id:'e6', date:'2024-04-06', description:'Staff wages – April advance', category:'Staff', amount:600 },
  { id:'e7', date:'2024-04-07', description:'Cooking oil and staples restock', category:'Stock Purchase', amount:950 },
  { id:'e8', date:'2024-04-08', description:'RetailIQ subscription', category:'Software', amount:60 },
  { id:'e9', date:'2024-04-09', description:'Packaging materials', category:'Supplies', amount:75 },
  { id:'e10', date:'2024-04-10', description:'Water bill', category:'Utilities', amount:40 },
];

export const seedInventory: InventoryItem[] = [
  { id:'i1', name:'Milo 500g', category:'Beverages', sku:'BEV-001', qty:48, reorderLevel:20, costPrice:14, sellingPrice:18, supplier:'Nestle Ghana', lastRestocked:'2024-04-01' },
  { id:'i2', name:'Rice 5kg', category:'Grains', sku:'GRN-001', qty:8, reorderLevel:15, costPrice:52, sellingPrice:65, supplier:'Olam Ghana', lastRestocked:'2024-04-04' },
  { id:'i3', name:'Nescafe 200g', category:'Beverages', sku:'BEV-002', qty:22, reorderLevel:10, costPrice:17, sellingPrice:22, supplier:'Nestle Ghana', lastRestocked:'2024-04-01' },
  { id:'i4', name:'Cooking Oil 2L', category:'Cooking', sku:'COK-001', qty:6, reorderLevel:12, costPrice:36, sellingPrice:45, supplier:'Wilmar Ghana', lastRestocked:'2024-04-07' },
  { id:'i5', name:'Sugar 1kg', category:'Staples', sku:'STP-001', qty:35, reorderLevel:20, costPrice:9, sellingPrice:12, supplier:'Bulk Supplier', lastRestocked:'2024-04-04' },
  { id:'i6', name:'Flour 2kg', category:'Staples', sku:'STP-002', qty:18, reorderLevel:10, costPrice:22, sellingPrice:28, supplier:'Bulk Supplier', lastRestocked:'2024-04-07' },
  { id:'i7', name:'Tomato Paste', category:'Cooking', sku:'COK-002', qty:60, reorderLevel:25, costPrice:5, sellingPrice:8, supplier:'Wilmar Ghana', lastRestocked:'2024-04-07' },
  { id:'i8', name:'Sardines 155g', category:'Proteins', sku:'PRO-001', qty:3, reorderLevel:20, costPrice:5, sellingPrice:7, supplier:'Fan Milk Dist.', lastRestocked:'2024-03-28' },
  { id:'i9', name:'Milk Powder 400g', category:'Beverages', sku:'BEV-003', qty:14, reorderLevel:8, costPrice:27, sellingPrice:35, supplier:'Nestle Ghana', lastRestocked:'2024-04-01' },
  { id:'i10', name:'Maize 5kg', category:'Grains', sku:'GRN-002', qty:25, reorderLevel:12, costPrice:30, sellingPrice:40, supplier:'Olam Ghana', lastRestocked:'2024-04-04' },
];

export const seedSuppliers: Supplier[] = [
  { id:'sup1', name:'Nestle Ghana Ltd', contact:'Samuel Acheampong', phone:'0244-123456', email:'samuel@nestle.com.gh', category:'Beverages', status:'active', totalOrders:24, rating:4.8 },
  { id:'sup2', name:'Olam Ghana', contact:'Grace Asiedu', phone:'0277-654321', email:'grace@olam.gh', category:'Grains', status:'active', totalOrders:18, rating:4.5 },
  { id:'sup3', name:'Wilmar Ghana', contact:'Joseph Mensah', phone:'0205-789012', email:'joseph@wilmar.gh', category:'Cooking', status:'active', totalOrders:12, rating:4.2 },
  { id:'sup4', name:'Fan Milk Distributors', contact:'Abena Asante', phone:'0244-345678', email:'abena@fanmilk.gh', category:'Proteins', status:'active', totalOrders:8, rating:4.6 },
  { id:'sup5', name:'Bulk Supplier Co.', contact:'Kweku Frimpong', phone:'0208-901234', category:'Staples', status:'active', totalOrders:30, rating:3.9 },
];

export const seedCustomers: Customer[] = [
  { id:'c1', name:'Ama Owusu', phone:'0244-111222', email:'ama@gmail.com', totalPurchases:426, lastVisit:'2024-04-08', loyaltyPoints:42, status:'vip' },
  { id:'c2', name:'Kofi Boateng', phone:'0277-333444', totalPurchases:541, lastVisit:'2024-04-08', loyaltyPoints:54, status:'vip' },
  { id:'c3', name:'Abena Mensah', phone:'0205-555666', totalPurchases:380, lastVisit:'2024-04-06', loyaltyPoints:38, status:'active' },
  { id:'c4', name:'Yaw Asante', phone:'0208-777888', totalPurchases:330, lastVisit:'2024-04-07', loyaltyPoints:33, status:'active' },
  { id:'c5', name:'Efua Darko', phone:'0244-999000', totalPurchases:280, lastVisit:'2024-04-05', loyaltyPoints:28, status:'active' },
  { id:'c6', name:'Kwame Acheampong', phone:'0277-112233', totalPurchases:510, lastVisit:'2024-04-05', loyaltyPoints:51, status:'vip' },
  { id:'c7', name:'Akosua Frimpong', phone:'0205-445566', totalPurchases:195, lastVisit:'2024-04-06', loyaltyPoints:19, status:'active' },
];

export const seedAlerts: Alert[] = [
  { id:'a1', type:'stock', title:'Low Stock Alert', message:'Rice 5kg is below reorder level (8 units left, reorder at 15)', date:'2024-04-10', read:false, severity:'danger' },
  { id:'a2', type:'stock', title:'Critical Stock', message:'Sardines 155g critically low — only 3 units remaining', date:'2024-04-10', read:false, severity:'danger' },
  { id:'a3', type:'stock', title:'Stock Warning', message:'Cooking Oil 2L approaching reorder level (6 units, reorder at 12)', date:'2024-04-09', read:false, severity:'warning' },
  { id:'a4', type:'insight', title:'Top Performer', message:'Milo 500g is your best-selling product this week — consider increasing stock', date:'2024-04-09', read:true, severity:'info' },
  { id:'a5', type:'insight', title:'Business Health', message:'Your Business Health Score improved to 74/100 — great work!', date:'2024-04-08', read:true, severity:'success' },
  { id:'a6', type:'achievement', title:'Revenue Milestone', message:'You crossed GHS 1,000 in revenue today for the first time!', date:'2024-04-07', read:true, severity:'success' },
  { id:'a7', type:'payment', title:'Credit Eligible', message:'Your Business Health Score qualifies you for a GHS 2,000 working capital loan', date:'2024-04-06', read:false, severity:'info' },
];
