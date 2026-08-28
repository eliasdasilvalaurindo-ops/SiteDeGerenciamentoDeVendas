import { stores, employees, formatCurrency } from "../data/mockData";
import { useApp } from "../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const storeColors = ["#c9963a", "#7c9e8e", "#9b7ec8", "#c87e7e"];

interface StoreDetailProps {
  storeId: number;
  onBack: () => void;
}

export default function StoreDetail({ storeId, onBack }: StoreDetailProps) {
  const { products, sales } = useApp();
  const storeIdx = stores.findIndex((s) => s.id === storeId);
  const store = stores[storeIdx];
  const color = storeColors[storeIdx];

  if (!store) return null;

  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const todayStr = `${pad(today.getDate())}/${pad(today.getMonth() + 1)}/${today.getFullYear()}`;

  const todaySales = sales.filter((s) => s.storeId === storeId && s.date === todayStr);
  const todayRevenue = todaySales.reduce((a, b) => a + b.total, 0);
  const storeProducts = products.filter((p) => p.storeId === storeId);
  const stock = storeProducts.reduce((a, b) => a + b.quantity, 0);
  const storeEmployees = employees.filter((e) => e.storeId === storeId);
  const allStoreSales = sales.filter((s) => s.storeId === storeId);
  const totalPieces = todaySales.reduce((a, b) => a + b.quantity, 0);

  const employeeBarData = storeEmployees.map((e) => ({
    name: e.name.split(" ")[0],
    receita: allStoreSales.filter((s) => s.employeeId === e.id).reduce((a, b) => a + b.total, 0),
  }));

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          Voltar para Lojas
        </button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold font-serif" style={{ backgroundColor: `${color}20`, color }}>
            {store.id}
          </div>
          <div>
            <h1 className="font-serif text-3xl text-[var(--foreground)]">{store.name}</h1>
            <p className="text-sm text-[var(--muted-foreground)]">{store.location}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Vendas hoje", value: formatCurrency(todayRevenue), sub: `${todaySales.length} transações`, highlight: true },
          { label: "Peças vendidas", value: String(totalPieces), sub: "hoje" },
          { label: "Estoque atual", value: `${stock} peças`, sub: `${storeProducts.length} produtos` },
          { label: "Equipe", value: `${storeEmployees.length} pessoas`, sub: store.location },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-xs text-[var(--muted-foreground)] mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold font-mono" style={kpi.highlight ? { color } : { color: "var(--foreground)" }}>{kpi.value}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="font-serif text-base text-[var(--foreground)]">Últimas Vendas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {["Produto", "Funcionário", "Tam.", "Qtd", "Valor", "Data/Hora"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allStoreSales.slice(0, 10).map((sale) => (
                  <tr key={sale.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--secondary)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm text-[var(--foreground)]">{sale.productName}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)]">{sale.date}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{sale.employeeName}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-[var(--secondary)] text-[var(--muted-foreground)] px-1.5 py-0.5 rounded font-mono">{sale.size}</span></td>
                    <td className="px-4 py-3 text-sm font-mono text-[var(--foreground)] text-center">{sale.quantity}</td>
                    <td className="px-4 py-3 text-sm font-bold font-mono" style={{ color }}>{formatCurrency(sale.total)}</td>
                    <td className="px-4 py-3 text-xs font-mono text-[var(--muted-foreground)]">{sale.date} {sale.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="font-serif text-base text-[var(--foreground)] mb-1">Desempenho da Equipe</h2>
          <p className="text-xs text-[var(--muted-foreground)] mb-5">Receita total acumulada</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={employeeBarData} layout="vertical" margin={{ top: 0, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [formatCurrency(v), "Receita"]} />
              <Bar dataKey="receita" fill={color} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-5 space-y-3">
            {storeEmployees.map((emp) => (
              <div key={emp.id} className="flex items-center gap-2.5">
                <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--foreground)] truncate">{emp.name}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">{emp.role}</p>
                </div>
                <p className="text-xs font-bold font-mono" style={{ color }}>
                  {formatCurrency(allStoreSales.filter((s) => s.employeeId === emp.id).reduce((a, b) => a + b.total, 0))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-serif text-base text-[var(--foreground)]">Estoque da Loja</h2>
          <span className="text-xs font-mono text-[var(--muted-foreground)]">{storeProducts.length} produtos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["Produto", "Código", "Categoria", "Tamanho", "Cor", "Preço", "Qtd"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {storeProducts.map((p) => {
                const isLow = p.quantity <= p.lowStockThreshold;
                return (
                  <tr key={p.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--secondary)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={p.imageUrl} alt={p.name} className="w-8 h-8 rounded-lg object-cover bg-[var(--secondary)]" />
                        <span className="text-sm text-[var(--foreground)]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-[var(--muted-foreground)]">{p.code}</td>
                    <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{p.category}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-[var(--secondary)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-md font-mono">{p.size}</span></td>
                    <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{p.color}</td>
                    <td className="px-4 py-3 text-sm font-bold font-mono" style={{ color }}>{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-md ${isLow ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>{p.quantity}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
