import { useMemo, useState } from "react";
import { MessageSquarePlus, Pin, PinOff, Search, Trash2, X, Sparkles } from "lucide-react";

const dayDiff = (d) => {
  const a = new Date(d); a.setHours(0, 0, 0, 0);
  const b = new Date(); b.setHours(0, 0, 0, 0);
  return Math.round((b - a) / 86400000);
};

function group(list) {
  const g = { Today: [], Yesterday: [], "Previous 7 days": [], Older: [] };
  list.forEach((c) => {
    const d = dayDiff(c.updated_at || c.created_at);
    (d <= 0 ? g.Today : d === 1 ? g.Yesterday : d <= 7 ? g["Previous 7 days"] : g.Older).push(c);
  });
  return Object.entries(g).filter(([, v]) => v.length);
}

function Row({ c, active, pinned, onSelect, onPin, onDelete }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className={`group relative flex items-center rounded-xl ${active ? "bg-blue-50" : "hover:bg-gray-100"}`}>
      <button onClick={() => onSelect(c)} className={`min-w-0 flex-1 truncate px-3 py-2 text-left text-sm ${active ? "font-medium text-blue-800" : "text-gray-700"}`} title={c.title}>
        {c.title || "New chat"}
      </button>
      {confirm ? (
        <div className="mr-1 flex items-center gap-1 text-xs">
          <button onClick={() => { onDelete(c); setConfirm(false); }} className="rounded-md bg-red-600 px-2 py-1 text-white">মুছুন</button>
          <button onClick={() => setConfirm(false)} className="rounded-md px-1.5 py-1 text-gray-500 hover:bg-gray-200">না</button>
        </div>
      ) : (
        <div className="mr-1 flex shrink-0 items-center opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <button aria-label={pinned ? "Unpin" : "Pin"} onClick={() => onPin(c.id)} className="grid h-7 w-7 place-items-center rounded-lg text-gray-500 hover:bg-gray-200">
            {pinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>
          <button aria-label="Delete" onClick={() => setConfirm(true)} className="grid h-7 w-7 place-items-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-red-600">
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function AISidebar({ open, onClose, conversations, loading, activeId, pins, onSelect, onNew, onPin, onDelete }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () => conversations.filter((c) => !q.trim() || (c.title || "").toLowerCase().includes(q.trim().toLowerCase())),
    [conversations, q]
  );
  const pinned = filtered.filter((c) => pins.includes(c.id));
  const rest = filtered.filter((c) => !pins.includes(c.id));
  const props = { pins, onSelect, onPin, onDelete };

  return (
    <>
      {open && <div className="absolute inset-0 z-20 bg-black/40 md:hidden" onClick={onClose} />}
      <aside
        className={`absolute inset-y-0 left-0 z-30 flex h-full min-h-0 w-72 shrink-0 flex-col overflow-hidden border-r bg-gray-50 transition-all duration-200 md:relative md:z-auto ${
          open ? "translate-x-0 md:w-72" : "-translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden md:border-r-0"
        }`}
      >
        <div className="flex w-72 shrink-0 flex-col gap-2 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-gray-900">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white"><Sparkles size={16} /></span>
              Pori AI
            </div>
            <button aria-label="Close sidebar" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-gray-200 md:hidden"><X size={18} /></button>
          </div>
          <button onClick={onNew} className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-sm font-medium text-gray-800 shadow-sm hover:border-blue-400 hover:text-blue-700">
            <MessageSquarePlus size={18} /> নতুন চ্যাট
          </button>
          <div className="flex items-center gap-2 rounded-xl bg-gray-200/60 px-3 py-2 text-sm">
            <Search size={15} className="text-gray-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="চ্যাট খুঁজুন" className="w-full bg-transparent outline-none placeholder:text-gray-500" />
          </div>
        </div>

        <div className="ai-scroll min-h-0 w-72 flex-1 space-y-4 overflow-y-auto overscroll-contain px-2 pb-4">
          {loading && <p className="px-3 text-xs text-gray-400">লোড হচ্ছে…</p>}
          {!loading && filtered.length === 0 && <p className="px-3 py-6 text-center text-xs text-gray-400">{q ? "কিছু পাওয়া যায়নি" : "এখনো কোনো চ্যাট নেই"}</p>}

          {pinned.length > 0 && (
            <section>
              <h3 className="mb-1 flex items-center gap-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400"><Pin size={11} /> Pinned</h3>
              {pinned.map((c) => <Row key={c.id} c={c} active={c.id === activeId} pinned {...props} />)}
            </section>
          )}
          {group(rest).map(([label, items]) => (
            <section key={label}>
              <h3 className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</h3>
              {items.map((c) => <Row key={c.id} c={c} active={c.id === activeId} pinned={false} {...props} />)}
            </section>
          ))}
        </div>
      </aside>
    </>
  );
}