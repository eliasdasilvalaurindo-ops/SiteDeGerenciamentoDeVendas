export interface Store {
  id: number;
  name: string;
  location: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  storeId: number;
  imageUrl: string;
  lowStockThreshold: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  storeId: number;
  employeeId: string;
  employeeName: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: string;
  time: string;
  category: string;
}

export interface Employee {
  id: string;
  name: string;
  storeId: number;
  role: string;
  avatar: string;
  sales: number;
  revenue: number;
}

export const stores: Store[] = [
  { id: 1, name: "Loja 1", location: "Shopping Center Norte", color: "#c9963a" },
  { id: 2, name: "Loja 2", location: "Av. Paulista", color: "#7c9e8e" },
  { id: 3, name: "Loja 3", location: "Shopping Morumbi", color: "#9b7ec8" },
  { id: 4, name: "Loja 4", location: "Rua Oscar Freire", color: "#c87e7e" },
];

export const employees: Employee[] = [
  { id: "e1", name: "João Silva", storeId: 1, role: "Vendedor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format", sales: 23, revenue: 2340 },
  { id: "e2", name: "Ana Costa", storeId: 1, role: "Gerente", avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c3e4?w=80&h=80&fit=crop&auto=format", sales: 18, revenue: 1980 },
  { id: "e3", name: "Maria Souza", storeId: 2, role: "Vendedora", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format", sales: 31, revenue: 3120 },
  { id: "e4", name: "Pedro Alves", storeId: 2, role: "Vendedor", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format", sales: 19, revenue: 1870 },
  { id: "e5", name: "Carla Mendes", storeId: 3, role: "Gerente", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&auto=format", sales: 27, revenue: 3540 },
  { id: "e6", name: "Lucas Nunes", storeId: 3, role: "Vendedor", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format", sales: 15, revenue: 1420 },
  { id: "e7", name: "Fernanda Lima", storeId: 4, role: "Gerente", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format", sales: 34, revenue: 4210 },
  { id: "e8", name: "Rafael Dias", storeId: 4, role: "Vendedor", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&auto=format", sales: 21, revenue: 2180 },
];

export const products: Product[] = [
  { id: "p1", name: "Camiseta Oversized", code: "CAM-001", category: "Camisetas", size: "G", color: "Preta", price: 89.90, quantity: 12, storeId: 1, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 5 },
  { id: "p2", name: "Calça Cargo", code: "CAL-002", category: "Calças", size: "M", color: "Bege", price: 159.90, quantity: 3, storeId: 1, imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 5 },
  { id: "p3", name: "Vestido Midi Floral", code: "VES-003", category: "Vestidos", size: "P", color: "Floral", price: 219.90, quantity: 8, storeId: 1, imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 3 },
  { id: "p4", name: "Blazer Alfaiataria", code: "BLA-004", category: "Blazers", size: "G", color: "Cinza", price: 349.90, quantity: 5, storeId: 1, imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4b8e4a?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 3 },
  { id: "p5", name: "Shorts Jeans", code: "SHO-005", category: "Shorts", size: "P", color: "Azul", price: 119.90, quantity: 2, storeId: 1, imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 5 },
  { id: "p6", name: "Regata Ribana", code: "REG-006", category: "Regatas", size: "M", color: "Branca", price: 59.90, quantity: 18, storeId: 2, imageUrl: "https://images.unsplash.com/photo-1532185335840-9793b49f8e2a?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 5 },
  { id: "p7", name: "Calça Wide Leg", code: "CAL-007", category: "Calças", size: "G", color: "Preta", price: 189.90, quantity: 7, storeId: 2, imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 4 },
  { id: "p8", name: "Jaqueta Jeans", code: "JAC-008", category: "Jaquetas", size: "M", color: "Azul Claro", price: 279.90, quantity: 4, storeId: 2, imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 3 },
  { id: "p9", name: "Saia Midi Plissada", code: "SAI-009", category: "Saias", size: "P", color: "Verde", price: 149.90, quantity: 6, storeId: 2, imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 3 },
  { id: "p10", name: "Moletom Cropped", code: "MOL-010", category: "Moletons", size: "G", color: "Rosa", price: 139.90, quantity: 1, storeId: 3, imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 4 },
  { id: "p11", name: "Conjunto Linho", code: "CON-011", category: "Conjuntos", size: "M", color: "Off White", price: 399.90, quantity: 9, storeId: 3, imageUrl: "https://images.unsplash.com/photo-1603344797033-f0f4f587ab60?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 3 },
  { id: "p12", name: "Camisa Social Slim", code: "CAM-012", category: "Camisas", size: "G", color: "Azul", price: 169.90, quantity: 11, storeId: 3, imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 4 },
  { id: "p13", name: "Vestido Longo", code: "VES-013", category: "Vestidos", size: "M", color: "Preto", price: 289.90, quantity: 2, storeId: 4, imageUrl: "https://images.unsplash.com/photo-1546961342-ea5f62d4e712?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 3 },
  { id: "p14", name: "Calça Alfaiataria", code: "CAL-014", category: "Calças", size: "P", color: "Caramelo", price: 229.90, quantity: 5, storeId: 4, imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4b8e4a?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 3 },
  { id: "p15", name: "Blusa Cropped Tricô", code: "BLU-015", category: "Blusas", size: "P", color: "Creme", price: 179.90, quantity: 8, storeId: 4, imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 3 },
  { id: "p16", name: "Bermuda Linho", code: "BER-016", category: "Bermudas", size: "G", color: "Caqui", price: 129.90, quantity: 14, storeId: 4, imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=200&h=200&fit=crop&auto=format", lowStockThreshold: 5 },
];

const today = new Date();
const fmt = (d: Date) => d.toLocaleDateString("pt-BR");

const generateSales = (): Sale[] => {
  const raw = [
    { pid: "p1", pname: "Camiseta Oversized", sid: 1, eid: "e1", ename: "João Silva", size: "G", color: "Preta", qty: 1, price: 89.90, daysAgo: 0, time: "10:32", cat: "Camisetas" },
    { pid: "p2", pname: "Calça Cargo", sid: 1, eid: "e2", ename: "Ana Costa", size: "M", color: "Bege", qty: 2, price: 159.90, daysAgo: 0, time: "10:41", cat: "Calças" },
    { pid: "p6", pname: "Regata Ribana", sid: 2, eid: "e3", ename: "Maria Souza", size: "P", color: "Branca", qty: 3, price: 59.90, daysAgo: 0, time: "11:05", cat: "Regatas" },
    { pid: "p11", pname: "Conjunto Linho", sid: 3, eid: "e5", ename: "Carla Mendes", size: "M", color: "Off White", qty: 1, price: 399.90, daysAgo: 0, time: "11:22", cat: "Conjuntos" },
    { pid: "p13", pname: "Vestido Longo", sid: 4, eid: "e7", ename: "Fernanda Lima", size: "M", color: "Preto", qty: 1, price: 289.90, daysAgo: 0, time: "12:14", cat: "Vestidos" },
    { pid: "p4", pname: "Blazer Alfaiataria", sid: 1, eid: "e1", ename: "João Silva", size: "G", color: "Cinza", qty: 1, price: 349.90, daysAgo: 0, time: "13:05", cat: "Blazers" },
    { pid: "p7", pname: "Calça Wide Leg", sid: 2, eid: "e4", ename: "Pedro Alves", size: "G", color: "Preta", qty: 1, price: 189.90, daysAgo: 0, time: "14:30", cat: "Calças" },
    { pid: "p15", pname: "Blusa Cropped Tricô", sid: 4, eid: "e8", ename: "Rafael Dias", size: "P", color: "Creme", qty: 2, price: 179.90, daysAgo: 0, time: "15:11", cat: "Blusas" },
    { pid: "p3", pname: "Vestido Midi Floral", sid: 1, eid: "e2", ename: "Ana Costa", size: "P", color: "Floral", qty: 1, price: 219.90, daysAgo: 1, time: "09:45", cat: "Vestidos" },
    { pid: "p8", pname: "Jaqueta Jeans", sid: 2, eid: "e3", ename: "Maria Souza", size: "M", color: "Azul Claro", qty: 1, price: 279.90, daysAgo: 1, time: "10:20", cat: "Jaquetas" },
    { pid: "p12", pname: "Camisa Social Slim", sid: 3, eid: "e6", ename: "Lucas Nunes", size: "G", color: "Azul", qty: 2, price: 169.90, daysAgo: 1, time: "11:38", cat: "Camisas" },
    { pid: "p14", pname: "Calça Alfaiataria", sid: 4, eid: "e7", ename: "Fernanda Lima", size: "P", color: "Caramelo", qty: 1, price: 229.90, daysAgo: 1, time: "14:55", cat: "Calças" },
    { pid: "p10", pname: "Moletom Cropped", sid: 3, eid: "e5", ename: "Carla Mendes", size: "G", color: "Rosa", qty: 1, price: 139.90, daysAgo: 2, time: "10:10", cat: "Moletons" },
    { pid: "p9", pname: "Saia Midi Plissada", sid: 2, eid: "e4", ename: "Pedro Alves", size: "P", color: "Verde", qty: 1, price: 149.90, daysAgo: 2, time: "13:22", cat: "Saias" },
    { pid: "p5", pname: "Shorts Jeans", sid: 1, eid: "e1", ename: "João Silva", size: "P", color: "Azul", qty: 1, price: 119.90, daysAgo: 2, time: "16:45", cat: "Shorts" },
    { pid: "p16", pname: "Bermuda Linho", sid: 4, eid: "e8", ename: "Rafael Dias", size: "G", color: "Caqui", qty: 3, price: 129.90, daysAgo: 3, time: "10:30", cat: "Bermudas" },
    { pid: "p1", pname: "Camiseta Oversized", sid: 1, eid: "e2", ename: "Ana Costa", size: "M", color: "Preta", qty: 2, price: 89.90, daysAgo: 3, time: "12:00", cat: "Camisetas" },
    { pid: "p11", pname: "Conjunto Linho", sid: 3, eid: "e6", ename: "Lucas Nunes", size: "P", color: "Off White", qty: 1, price: 399.90, daysAgo: 4, time: "09:15", cat: "Conjuntos" },
    { pid: "p7", pname: "Calça Wide Leg", sid: 2, eid: "e3", ename: "Maria Souza", size: "M", color: "Preta", qty: 1, price: 189.90, daysAgo: 4, time: "11:50", cat: "Calças" },
    { pid: "p13", pname: "Vestido Longo", sid: 4, eid: "e7", ename: "Fernanda Lima", size: "G", color: "Preto", qty: 1, price: 289.90, daysAgo: 5, time: "14:20", cat: "Vestidos" },
  ];

  return raw.map((s, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - s.daysAgo);
    return {
      id: `s${i + 1}`,
      productId: s.pid,
      productName: s.pname,
      storeId: s.sid,
      employeeId: s.eid,
      employeeName: s.ename,
      size: s.size,
      color: s.color,
      quantity: s.qty,
      unitPrice: s.price,
      total: +(s.qty * s.price).toFixed(2),
      date: fmt(d),
      time: s.time,
      category: s.cat,
    };
  });
};

export const sales: Sale[] = generateSales();

export const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const getTodaySales = (storeId?: number) => {
  const todayStr = fmt(today);
  return sales.filter(s => s.date === todayStr && (storeId == null || s.storeId === storeId));
};

export const getStoreTodayRevenue = (storeId: number) =>
  getTodaySales(storeId).reduce((sum, s) => sum + s.total, 0);

export const getStoreStock = (storeId: number) =>
  products.filter(p => p.storeId === storeId).reduce((sum, p) => sum + p.quantity, 0);

export const getSalesChartData = () => {
  const days: { date: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({ date: fmt(d), label: d.toLocaleDateString("pt-BR", { weekday: "short" }) });
  }
  return days.map(({ date, label }) => ({
    label,
    loja1: sales.filter(s => s.storeId === 1 && s.date === date).reduce((a, b) => a + b.total, 0),
    loja2: sales.filter(s => s.storeId === 2 && s.date === date).reduce((a, b) => a + b.total, 0),
    loja3: sales.filter(s => s.storeId === 3 && s.date === date).reduce((a, b) => a + b.total, 0),
    loja4: sales.filter(s => s.storeId === 4 && s.date === date).reduce((a, b) => a + b.total, 0),
  }));
};

export const getTopProducts = () => {
  const map: Record<string, { name: string; qty: number; revenue: number }> = {};
  sales.forEach(s => {
    if (!map[s.productId]) map[s.productId] = { name: s.productName, qty: 0, revenue: 0 };
    map[s.productId].qty += s.quantity;
    map[s.productId].revenue += s.total;
  });
  return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5);
};

export const getEmployeeStats = () =>
  employees.map(e => ({
    name: e.name.split(" ")[0],
    vendas: sales.filter(s => s.employeeId === e.id).reduce((a, b) => a + b.quantity, 0),
    receita: +sales.filter(s => s.employeeId === e.id).reduce((a, b) => a + b.total, 0).toFixed(2),
  })).sort((a, b) => b.receita - a.receita).slice(0, 6);
