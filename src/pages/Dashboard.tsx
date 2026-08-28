import { stores, formatCurrency, employees } from "../data/mockData";
import { useApp } from "../context/AppContext";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

const storeColors = ["#c9963a", "#7c9e8e", "#9b7ec8", "#c87e7e"];

interface DashboardProps {
  onStoreClick: (storeId: number) => void;
}

export default function Dashboard({ onStoreClick }: DashboardProps) {
  const { products, sales } = useApp();

  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const todayStr = `${pad(today.getDate())}/${pad(today.getMonth() + 1)}/${today.getFullYear()}`;

  const getTodaySales = (storeId?: number) =>
    sales.filter((s) => s.date === todayStr && (storeId == null || s.storeId === storeId));

  const getRevenue = (storeId: number) =>
    getTodaySales(storeId).reduce((a, b) => a + b.total, 0);

  const getStock = (storeId: number) =>
    products.filter((p) => p.storeId === storeId).reduce((a, b) => a + b.quantity, 0);

  const totalRevenue = stores.reduce((s, st) => s + getRevenue(st.id), 0);
  const totalSales = getTodaySales().length;
  const totalStock = products.reduce((a, b) => a + b.quantity, 0);

  // 7-day chart
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const ds = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    const label = d.toLocaleDateString("pt-BR", { weekday: "short" });
    return {
      label,
      loja1: sales.filter((s) => s.storeId === 1 && s.date === ds).reduce((a, b) => a + b.total, 0),
      loja2: sales.filter((s) => s.storeId === 2 && s.date === ds).reduce((a, b) => a + b.total, 0),
      loja3: sales.filter((s) => s.storeId === 3 && s.date === ds).reduce((a, b) => a + b.total, 0),
      loja4: sales.filter((s) => s.storeId === 4 && s.date === ds).reduce((a, b) => a + b.total, 0),
    };
  });

  // Top products
  const productMap: Record<string, { name: string; qty: number }> = {};
  sales.forEach((s) => {
    if (!productMap[s.productId]) productMap[s.productId] = { name: s.productName, qty: 0 };
    productMap[s.productId].qty += s.quantity;
  });
  const topProducts = Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-[var(--muted-foreground)] tracking-widest uppercase mb-1">
            {today.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <h1 className="font-serif text-3xl text-[var(--foreground)]">Controle de Lojas</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--muted)] border border-[var(--border)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-[var(--muted-foreground)] font-mono">4 lojas online</span>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Receita hoje", value: formatCurrency(totalRevenue) },
          { label: "Vendas hoje", value: String(totalSales) },
          { label: "Total em estoque", value: `${totalStock} peças` },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex flex-col gap-1">
            <p className="text-xs text-[var(--muted-foreground)] font-mono">{s.label}</p>
            <p className="text-xl font-semibold text-[var(--foreground)]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Store cards */}
      <div>
        <h2 className="font-serif text-xl text-[var(--foreground)] mb-4">Resumo por Loja</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stores.map((store, i) => {
            const todaySales = getTodaySales(store.id);
            const revenue = getRevenue(store.id);
            const stock = getStock(store.id);
            const color = storeColors[i];
            return (
              <button
                key={store.id}
                onClick={() => onStoreClick(store.id)}
                className="text-left bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--primary)]/40 hover:bg-[var(--secondary)] transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold"
                      style={{ backgroundColor: `${color}20`, color }}
                    >
                      {store.id}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{store.name}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">{store.location}</p>
                    </div>
                  </div>
                  <svg className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--muted-foreground)]">Estoque atual</span>
                    <span className="text-sm font-semibold text-[var(--foreground)] font-mono">{stock} peças</span>
                  </div>
                  <div className="w-full h-px bg-[var(--border)]" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--muted-foreground)]">Vendas hoje</span>
                    <span className="text-sm font-semibold text-[var(--foreground)] font-mono">{todaySales.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[var(--muted-foreground)]">Valor vendido</span>
                    <span className="text-sm font-bold" style={{ color }}>{formatCurrency(revenue)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-base text-[var(--foreground)]">Evolução de Vendas</h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Últimos 7 dias · por loja</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {stores.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: storeColors[i] }} />
                  <span className="text-[11px] text-[var(--muted-foreground)]">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                {storeColors.map((color, i) => (
                  <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} width={60} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--foreground)" }}
                formatter={(v: number) => [formatCurrency(v), ""]}
              />
              {["loja1", "loja2", "loja3", "loja4"].map((key, i) => (
                <Area key={key} type="monotone" dataKey={key} stroke={storeColors[i]} strokeWidth={2} fill={`url(#grad${i})`} dot={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h3 className="font-serif text-base text-[var(--foreground)] mb-1">Produtos Mais Vendidos</h3>
          <p className="text-xs text-[var(--muted-foreground)] mb-5">Total acumulado</p>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-[var(--foreground)] font-medium truncate pr-2">{p.name}</span>
                  <span className="text-xs font-mono text-[var(--muted-foreground)] shrink-0">{p.qty} un.</span>
                </div>
                <div className="h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(p.qty / (topProducts[0]?.qty || 1)) * 100}%`, backgroundColor: storeColors[i % 4] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
