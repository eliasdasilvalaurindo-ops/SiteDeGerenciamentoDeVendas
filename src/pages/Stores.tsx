import { stores, employees, formatCurrency } from "../data/mockData";
import { useApp } from "../context/AppContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

const storeColors = ["#c9963a", "#7c9e8e", "#9b7ec8", "#c87e7e"];

interface StoresProps {
  onStoreClick: (storeId: number) => void;
}

export default function Stores({ onStoreClick }: StoresProps) {
  const { products, sales } = useApp();

  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const todayStr = `${pad(today.getDate())}/${pad(today.getMonth() + 1)}/${today.getFullYear()}`;

  const getTodaySales = (storeId: number) =>
    sales.filter((s) => s.storeId === storeId && s.date === todayStr);
  const getRevenue = (storeId: number) =>
    getTodaySales(storeId).reduce((a, b) => a + b.total, 0);
  const getStock = (storeId: number) =>
    products.filter((p) => p.storeId === storeId).reduce((a, b) => a + b.quantity, 0);

  const storeStats = stores.map((s, i) => ({
    store: s,
    color: storeColors[i],
    todaySales: getTodaySales(s.id),
    todayRevenue: getRevenue(s.id),
    stock: getStock(s.id),
    team: employees.filter((e) => e.storeId === s.id),
    storeProducts: products.filter((p) => p.storeId === s.id),
  }));

  const barData = stores.map((s, i) => ({
    name: s.name,
    receita: getRevenue(s.id),
    fill: storeColors[i],
  }));

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto">
      <div>
        <h1 className="font-serif text-3xl text-[var(--foreground)]">Lojas</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Visão geral das 4 unidades</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {storeStats.map(({ store, color, todaySales, todayRevenue, stock, team }) => (
          <button
            key={store.id}
            onClick={() => onStoreClick(store.id)}
            className="text-left bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 transition-all duration-200 cursor-pointer group"
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${color}60`)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold font-serif" style={{ backgroundColor: `${color}20`, color }}>
                {store.id}
              </div>
              <svg className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <h3 className="font-serif text-lg text-[var(--foreground)]">{store.name}</h3>
            <p className="text-xs text-[var(--muted-foreground)] mb-4">{store.location}</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Receita hoje", value: formatCurrency(todayRevenue), highlight: true },
                { label: "Vendas hoje", value: String(todaySales.length) },
                { label: "Estoque", value: `${stock} peças` },
                { label: "Equipe", value: `${team.length} pessoas` },
              ].map((stat) => (
                <div key={stat.label} className="bg-[var(--secondary)] rounded-lg p-2.5">
                  <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">{stat.label}</p>
                  <p className="text-xs font-bold font-mono" style={stat.highlight ? { color } : { color: "var(--foreground)" }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h3 className="font-serif text-base text-[var(--foreground)] mb-1">Receita por Loja (hoje)</h3>
          <p className="text-xs text-[var(--muted-foreground)] mb-5">Comparativo de vendas do dia</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} width={55} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), "Receita"]} />
              <Bar dataKey="receita" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h3 className="font-serif text-base text-[var(--foreground)] mb-1">Performance Comparativa</h3>
          <p className="text-xs text-[var(--muted-foreground)] mb-3">Métricas normalizadas por loja</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={[
              { metric: "Estoque", ...Object.fromEntries(stores.map(s => [`loja${s.id}`, getStock(s.id)])) },
              { metric: "Vendas", ...Object.fromEntries(stores.map(s => [`loja${s.id}`, getTodaySales(s.id).length * 50])) },
              { metric: "Receita", ...Object.fromEntries(stores.map(s => [`loja${s.id}`, getRevenue(s.id)])) },
              { metric: "Equipe", ...Object.fromEntries(stores.map(s => [`loja${s.id}`, employees.filter(e => e.storeId === s.id).length * 50])) },
              { metric: "Produtos", ...Object.fromEntries(stores.map(s => [`loja${s.id}`, products.filter(p => p.storeId === s.id).length * 30])) },
            ]} cx="50%" cy="50%" outerRadius={80}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
              {stores.map((s, i) => (
                <Radar key={s.id} name={s.name} dataKey={`loja${s.id}`} stroke={storeColors[i]} fill={storeColors[i]} fillOpacity={0.08} strokeWidth={1.5} dot={false} />
              ))}
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {stores.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: storeColors[i] }} />
                <span className="text-[11px] text-[var(--muted-foreground)]">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
