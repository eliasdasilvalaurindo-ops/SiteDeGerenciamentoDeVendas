import { createContext, useContext, useState, type ReactNode } from "react";
import {
  products as initialProducts,
  sales as initialSales,
  employees,
  stores,
  type Product,
  type Sale,
} from "../data/mockData";

interface AppState {
  products: Product[];
  sales: Sale[];
  addStock: (productId: string, qty: number) => void;
  removeStock: (productId: string, qty: number) => void;
  registerSale: (params: {
    productId: string;
    employeeName: string;
    quantity: number;
  }) => { ok: boolean; message: string };
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sales, setSales] = useState<Sale[]>(initialSales);

  const addStock = (productId: string, qty: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: p.quantity + qty } : p))
    );
  };

  const removeStock = (productId: string, qty: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: Math.max(0, p.quantity - qty) } : p
      )
    );
  };

  const registerSale = ({
    productId,
    employeeName,
    quantity,
  }: {
    productId: string;
    employeeName: string;
    quantity: number;
  }): { ok: boolean; message: string } => {
    const product = products.find((p) => p.id === productId);
    if (!product) return { ok: false, message: "Produto não encontrado." };
    if (product.quantity < quantity)
      return { ok: false, message: `Estoque insuficiente. Disponível: ${product.quantity} un.` };

    const store = stores.find((s) => s.id === product.storeId);
    const employee = employees.find(
      (e) => e.name.toLowerCase().includes(employeeName.toLowerCase()) && e.storeId === product.storeId
    );

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newSale: Sale = {
      id: `s${Date.now()}`,
      productId: product.id,
      productName: product.name,
      storeId: product.storeId,
      employeeId: employee?.id ?? `ext_${employeeName}`,
      employeeName: employee?.name ?? employeeName,
      size: product.size,
      color: product.color,
      quantity,
      unitPrice: product.price,
      total: +(quantity * product.price).toFixed(2),
      date: dateStr,
      time: timeStr,
      category: product.category,
    };

    setSales((prev) => [newSale, ...prev]);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - quantity } : p))
    );

    return {
      ok: true,
      message: `Venda registrada! ${quantity}× ${product.name} — ${store?.name}`,
    };
  };

  return (
    <AppContext.Provider value={{ products, sales, addStock, removeStock, registerSale }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
