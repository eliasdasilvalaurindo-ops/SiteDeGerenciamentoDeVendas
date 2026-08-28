import { useState } from "react";
import { stores, employees, formatCurrency } from "../data/mockData";
import { useApp } from "../context/AppContext";

export default function Sales() {
  const { sales } = useApp();
  const [filterStore, setFilterStore] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");

  const categories = [...new Set(sales.map((s) => s.category))].sort();
  const storeColors = ["#c9963a", "#7c9e8e", "#9b7ec8", "#c87e7e"];

  const filtered = sales.filter((s) => {
    if (filterStore && s.storeId !== Number(filterStore)) return false;
    if (filterEmployee && s.employeeId !== filterEmployee) return false;
    if (filterCategory && s.category !== filterCategory) return false;
    if (filterDate && s.date !== filterDate) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!s.productName.toLowerCase().includes(q) && !s.employeeName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalRevenue = filtered.reduce((a, b) => a + b.total, 0);

  const clearFilters = () => {
    setFilterStore(""); setFilterEmployee(""); setFilterCategory("");
    setFilterDate(""); setSearch("");
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[var(--foreground)]">Vendas</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            {filtered.length} venda{filtered.length !== 1 ? "s" : ""} · {formatCurrency(totalRevenue)} total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Filtros</p>
          <button onClick={clearFilters} className="text-xs text-[var(--primary)] hover:opacity-80 transition-opacity">Limpar tudo</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <div className="relative col-span-2 sm:col-span-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-8 pr-3 py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>
          {[
            { label: "Loja", value: filterStore, onChange: setFilterStore, options: stores.map(s => ({ v: String(s.id), l: s.name })) },
            { label: "Funcionário", value: filterEmployee, onChange: setFilterEmployee, options: employees.map(e => ({ v: e.id, l: e.name.split(" ")[0] })) },
            { label: "Categoria", value: filterCategory, onChange: setFilterCategory, options: categories.map(c => ({ v: c, l: c })) },
          ].map((f) => (
            <select
              key={f.label}
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="py-2 px-3 bg-[var(--secondary)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] appearance-none cursor-pointer"
            >
              <option value="">{f.label}</option>
              {f.options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          ))}
          <input
            type="date"
            value={filterDate ? filterDate.split("/").reverse().join("-") : ""}
            onChange={(e) => {
              if (e.target.value) {
                const [y, m, d] = e.target.value.split("-");
                setFilterDate(`${d}/${m}/${y}`);
              } else setFilterDate("");
            }}
            className="py-2 px-3 bg-[var(--secondary)] border border-[var(--border)] rounded-lg text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] cursor-pointer"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["Produto", "Loja", "Funcionário", "Tamanho", "Cor", "Qtd", "Valor Unit.", "Total", "Data/Hora"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sale, i) => {
                const storeIdx = stores.findIndex((s) => s.id === sale.storeId);
                const color = storeColors[storeIdx];
                return (
                  <tr key={sale.id} className={`border-b border-[var(--border)] last:border-0 hover:bg-[var(--secondary)]/50 transition-colors ${i % 2 === 0 ? "" : "bg-[var(--secondary)]/20"}`}>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[var(--foreground)]">{sale.productName}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)]">{sale.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded-md" style={{ backgroundColor: `${color}20`, color }}>
                        {stores.find(s => s.id === sale.storeId)?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--foreground)] whitespace-nowrap">{sale.employeeName}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-[var(--secondary)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-md font-mono">{sale.size}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">{sale.color}</td>
                    <td className="px-4 py-3 text-sm font-mono text-[var(--foreground)] text-center">{sale.quantity}</td>
                    <td className="px-4 py-3 text-sm font-mono text-[var(--muted-foreground)]">{formatCurrency(sale.unitPrice)}</td>
                    <td className="px-4 py-3 text-sm font-bold font-mono text-[var(--primary)]">{formatCurrency(sale.total)}</td>
                    <td className="px-4 py-3 text-xs font-mono text-[var(--muted-foreground)] whitespace-nowrap">{sale.date} {sale.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-[var(--muted-foreground)]">
            <p className="text-sm">Nenhuma venda encontrada com os filtros selecionados</p>
          </div>
        )}
      </div>
    </div>
  );
}
