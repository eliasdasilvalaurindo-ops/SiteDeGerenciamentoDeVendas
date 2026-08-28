import { useState } from "react";
import { employees, stores, formatCurrency } from "../data/mockData";
import { useApp } from "../context/AppContext";

const storeColors = ["#c9963a", "#7c9e8e", "#9b7ec8", "#c87e7e"];

export default function Employees() {
  const { sales } = useApp();
  const [filterStore, setFilterStore] = useState<number | null>(null);

  const enriched = employees.map((e) => {
    const empSales = sales.filter((s) => s.employeeId === e.id);
    return {
      ...e,
      totalSales: empSales.reduce((a, b) => a + b.quantity, 0),
      totalRevenue: empSales.reduce((a, b) => a + b.total, 0),
      txCount: empSales.length,
    };
  });

  const sorted = [...enriched].sort((a, b) => b.totalRevenue - a.totalRevenue);
  const filtered = filterStore ? sorted.filter((e) => e.storeId === filterStore) : sorted;
  const maxRevenue = sorted[0]?.totalRevenue || 1;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="font-serif text-3xl text-[var(--foreground)]">Funcionários</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">{filtered.length} colaboradores</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStore(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStore == null ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]"}`}
        >
          Todos
        </button>
        {stores.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setFilterStore(s.id === filterStore ? null : s.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
            style={filterStore === s.id ? { backgroundColor: `${storeColors[i]}25`, borderColor: storeColors[i], color: storeColors[i] } : { background: "var(--secondary)", color: "var(--muted-foreground)", borderColor: "var(--border)" }}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((emp) => {
          const storeIdx = stores.findIndex((s) => s.id === emp.storeId);
          const color = storeColors[storeIdx];
          const store = stores.find((s) => s.id === emp.storeId);
          const pct = (emp.totalRevenue / maxRevenue) * 100;
          return (
            <div key={emp.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--primary)]/30 transition-all duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full object-cover border-2" style={{ borderColor: `${color}50` }} />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[var(--card)] bg-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{emp.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{emp.role}</p>
                </div>
              </div>
              <div className="text-[11px] font-semibold px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 mb-4" style={{ backgroundColor: `${color}20`, color }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                {store?.name}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--muted-foreground)]">Transações</span>
                  <span className="text-xs font-mono text-[var(--foreground)]">{emp.txCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--muted-foreground)]">Peças vendidas</span>
                  <span className="text-xs font-mono text-[var(--foreground)]">{emp.totalSales}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs text-[var(--muted-foreground)]">Receita total</span>
                  <span className="text-sm font-bold" style={{ color }}>{formatCurrency(emp.totalRevenue)}</span>
                </div>
                <div className="pt-1">
                  <div className="h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-serif text-base text-[var(--foreground)]">Ranking de Vendas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["#", "Funcionário", "Loja", "Cargo", "Transações", "Peças", "Receita"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((emp, i) => {
                const storeIdx = stores.findIndex((s) => s.id === emp.storeId);
                const color = storeColors[storeIdx];
                return (
                  <tr key={emp.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--secondary)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold font-mono ${i === 0 ? "text-[var(--primary)]" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-700" : "text-[var(--muted-foreground)]"}`}>{i + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                        <span className="text-sm text-[var(--foreground)]">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${color}20`, color }}>{stores.find(s => s.id === emp.storeId)?.name}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">{emp.role}</td>
                    <td className="px-4 py-3 text-sm font-mono text-[var(--foreground)]">{emp.txCount}</td>
                    <td className="px-4 py-3 text-sm font-mono text-[var(--foreground)]">{emp.totalSales}</td>
                    <td className="px-4 py-3 text-sm font-bold font-mono text-[var(--primary)]">{formatCurrency(emp.totalRevenue)}</td>
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
