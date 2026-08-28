import { useState, useMemo } from "react";
import { stores, employees, formatCurrency, type Product } from "../data/mockData";
import { useApp } from "../context/AppContext";

const storeColors = ["#c9963a", "#7c9e8e", "#9b7ec8", "#c87e7e"];

/* ── Adjust Stock Modal ─────────────────────────────────────── */
function AdjustModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addStock, removeStock } = useApp();
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);

  const storeIdx = stores.findIndex((s) => s.id === product.storeId);
  const color = storeColors[storeIdx];

  const handleConfirm = () => {
    if (qty < 1) return;
    if (mode === "add") addStock(product.id, qty);
    else removeStock(product.id, qty);
    setDone(true);
    setTimeout(onClose, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-sm p-6 space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-[var(--foreground)]">Ajustar Estoque</h3>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <img src={product.imageUrl} alt={product.name} className="w-14 h-14 rounded-xl object-cover bg-[var(--secondary)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{product.name}</p>
            <p className="text-xs text-[var(--muted-foreground)] font-mono">{product.code} · {product.size} · {product.color}</p>
            <p className="text-xs mt-1" style={{ color }}>Estoque atual: <span className="font-bold">{product.quantity} un.</span></p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2">
          {(["add", "remove"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${
                mode === m
                  ? m === "add"
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                    : "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-[var(--secondary)] border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {m === "add" ? "＋ Adicionar" : "－ Remover"}
            </button>
          ))}
        </div>

        {/* Quantity */}
        <div>
          <label className="text-xs text-[var(--muted-foreground)] mb-2 block">Quantidade</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-lg bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] text-lg flex items-center justify-center hover:bg-[var(--muted)] transition-colors"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              className="flex-1 text-center py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-mono font-bold text-lg focus:outline-none focus:border-[var(--primary)]"
            />
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 rounded-lg bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] text-lg flex items-center justify-center hover:bg-[var(--muted)] transition-colors"
            >
              ＋
            </button>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={done}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
            done
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
          }`}
        >
          {done ? "✓ Atualizado!" : `Confirmar ${mode === "add" ? "entrada" : "saída"} de ${qty} peça${qty !== 1 ? "s" : ""}`}
        </button>
      </div>
    </div>
  );
}

/* ── Register Sale Modal ────────────────────────────────────── */
function RegisterSaleModal({ onClose }: { onClose: () => void }) {
  const { products, registerSale } = useApp();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [employeeName, setEmployeeName] = useState("");
  const [qty, setQty] = useState(1);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const suggestions = useMemo(() => {
    if (!query || selected) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query, selected, products]);

  const storeEmployees = selected
    ? employees.filter((e) => e.storeId === selected.storeId)
    : [];

  const storeIdx = selected ? stores.findIndex((s) => s.id === selected.storeId) : -1;
  const color = storeIdx >= 0 ? storeColors[storeIdx] : "var(--primary)";

  const handleSubmit = () => {
    if (!selected || !employeeName.trim()) return;
    const res = registerSale({ productId: selected.id, employeeName: employeeName.trim(), quantity: qty });
    setResult(res);
    if (res.ok) setTimeout(onClose, 1400);
  };

  const reset = () => {
    setSelected(null);
    setQuery("");
    setQty(1);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg text-[var(--foreground)]">Registrar Venda</h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">O estoque é deduzido automaticamente</p>
          </div>
          <button onClick={onClose} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Product search */}
        <div>
          <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Produto (nome ou código)</label>
          {selected ? (
            <div
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ borderColor: `${color}50`, backgroundColor: `${color}10` }}
            >
              <img src={selected.imageUrl} alt={selected.name} className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">{selected.name}</p>
                <p className="text-xs font-mono" style={{ color }}>
                  {selected.code} · {selected.size} · {selected.color}
                </p>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  {stores.find((s) => s.id === selected.storeId)?.name} · Estoque: {
                    products.find(p => p.id === selected.id)?.quantity
                  } un. · {formatCurrency(selected.price)}
                </p>
              </div>
              <button onClick={reset} className="text-[var(--muted-foreground)] hover:text-red-400 transition-colors shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="Ex: CAM-001 ou Camiseta Oversized..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-xl z-10">
                  {suggestions.map((p) => {
                    const si = stores.findIndex((s) => s.id === p.storeId);
                    const c = storeColors[si];
                    return (
                      <button
                        key={p.id}
                        onClick={() => { setSelected(p); setQuery(p.name); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--secondary)] transition-colors text-left"
                      >
                        <img src={p.imageUrl} alt={p.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--foreground)] truncate">{p.name}</p>
                          <p className="text-[11px] text-[var(--muted-foreground)] font-mono">{p.code} · {p.size}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold font-mono" style={{ color: c }}>
                            {formatCurrency(p.price)}
                          </p>
                          <p className="text-[10px] text-[var(--muted-foreground)]">
                            {stores.find((s) => s.id === p.storeId)?.name}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Employee */}
        <div>
          <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Seu nome (vendedor)</label>
          {selected && storeEmployees.length > 0 ? (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {storeEmployees.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setEmployeeName(e.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      employeeName === e.name
                        ? "text-[var(--foreground)] border-transparent"
                        : "bg-[var(--secondary)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]"
                    }`}
                    style={employeeName === e.name ? { backgroundColor: `${color}20`, borderColor: `${color}50`, color } : {}}
                  >
                    <img src={e.avatar} alt={e.name} className="w-4 h-4 rounded-full object-cover" />
                    {e.name.split(" ")[0]}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Ou digite outro nome..."
                value={storeEmployees.find(e => e.name === employeeName) ? "" : employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
              />
            </div>
          ) : (
            <input
              type="text"
              placeholder="Seu nome completo..."
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          )}
        </div>

        {/* Quantity */}
        {selected && (
          <div>
            <label className="text-xs text-[var(--muted-foreground)] mb-1.5 block">Quantidade</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-lg bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] text-lg flex items-center justify-center hover:bg-[var(--muted)] transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                className="flex-1 text-center py-2 bg-[var(--secondary)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-mono font-bold text-lg focus:outline-none focus:border-[var(--primary)]"
              />
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 rounded-lg bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] text-lg flex items-center justify-center hover:bg-[var(--muted)] transition-colors"
              >
                ＋
              </button>
            </div>
          </div>
        )}

        {/* Total preview */}
        {selected && (
          <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-[var(--secondary)] border border-[var(--border)]">
            <span className="text-xs text-[var(--muted-foreground)]">Total da venda</span>
            <span className="text-lg font-bold font-mono" style={{ color }}>
              {formatCurrency(qty * selected.price)}
            </span>
          </div>
        )}

        {/* Feedback */}
        {result && (
          <div className={`px-4 py-3 rounded-xl text-sm font-medium ${result.ok ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
            {result.message}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selected || !employeeName.trim() || !!result?.ok}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
            !selected || !employeeName.trim()
              ? "bg-[var(--secondary)] text-[var(--muted-foreground)] cursor-not-allowed border border-[var(--border)]"
              : result?.ok
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
          }`}
        >
          {result?.ok ? "✓ Venda registrada!" : "Confirmar Venda"}
        </button>
      </div>
    </div>
  );
}

/* ── Main Inventory Page ────────────────────────────────────── */
export default function Inventory() {
  const { products } = useApp();
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [adjustTarget, setAdjustTarget] = useState<Product | null>(null);
  const [saleModalOpen, setSaleModalOpen] = useState(false);

  const filtered = products.filter((p) => {
    const storeOk = selectedStore == null || p.storeId === selectedStore;
    const q = search.toLowerCase();
    const searchOk = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.color.toLowerCase().includes(q);
    return storeOk && searchOk;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[var(--foreground)]">Estoque</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">{filtered.length} produtos exibidos</p>
        </div>
        <button
          onClick={() => setSaleModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[var(--primary)]/20"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          Registrar Venda
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar produto, código, cor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[var(--secondary)] border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedStore(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedStore == null
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]"
            }`}
          >
            Todas
          </button>
          {stores.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSelectedStore(s.id === selectedStore ? null : s.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
              style={
                selectedStore === s.id
                  ? { backgroundColor: `${storeColors[i]}25`, borderColor: storeColors[i], color: storeColors[i] }
                  : { background: "var(--secondary)", color: "var(--muted-foreground)", borderColor: "var(--border)" }
              }
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          Estoque baixo
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Disponível
        </div>
        <span>· Clique em qualquer card para ajustar quantidade</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((product) => {
          const store = stores.find((s) => s.id === product.storeId);
          const storeIdx = stores.findIndex((s) => s.id === product.storeId);
          const isLow = product.quantity <= product.lowStockThreshold;
          const color = storeColors[storeIdx];

          return (
            <div
              key={product.id}
              onClick={() => setAdjustTarget(product)}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--primary)]/30 transition-all duration-200 group cursor-pointer"
            >
              <div className="relative aspect-square bg-[var(--secondary)] overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {isLow && (
                  <div className="absolute top-2 left-2 bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    BAIXO
                  </div>
                )}
                <div
                  className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${color}30`, color }}
                >
                  {store?.name}
                </div>
                {/* Edit overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-1.5 text-white text-xs font-medium flex items-center gap-1.5">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Ajustar
                  </div>
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div>
                  <p className="text-[11px] font-mono text-[var(--muted-foreground)]">{product.code}</p>
                  <p className="text-sm font-semibold text-[var(--foreground)] leading-tight mt-0.5">{product.name}</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="text-[10px] bg-[var(--secondary)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-md">{product.size}</span>
                  <span className="text-[10px] bg-[var(--secondary)] text-[var(--muted-foreground)] px-2 py-0.5 rounded-md">{product.color}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]">
                  <span className="text-sm font-bold text-[var(--primary)]">{formatCurrency(product.price)}</span>
                  <span className={`text-xs font-mono font-semibold ${isLow ? "text-red-400" : "text-emerald-400"}`}>
                    {product.quantity} un.
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[var(--muted-foreground)]">
          <svg className="mx-auto mb-3 opacity-30" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p className="text-sm">Nenhum produto encontrado</p>
        </div>
      )}

      {/* Modals */}
      {adjustTarget && (
        <AdjustModal product={adjustTarget} onClose={() => setAdjustTarget(null)} />
      )}
      {saleModalOpen && (
        <RegisterSaleModal onClose={() => setSaleModalOpen(false)} />
      )}
    </div>
  );
}
