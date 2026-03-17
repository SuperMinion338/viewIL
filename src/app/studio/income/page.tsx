"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 as LoaderIcon } from "lucide-react";
import Sidebar from "@/components/studio/Sidebar";
import MobileTopBar from "@/components/studio/MobileTopBar";
import MobileBottomNav from "@/components/studio/MobileBottomNav";
import {
  PlusCircle, Trash2, Download, Loader2, TrendingUp,
  Calendar, DollarSign, BarChart3,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const INCOME_TYPES = ["ספונסר", "עמלת אפיליאציה", "מתנות לייב", "מכירת קורס", "אחר"];
const PLATFORMS = ["Instagram", "TikTok", "YouTube", "אחר"];

const TYPE_COLORS: Record<string, string> = {
  "ספונסר": "#3B82F6",
  "עמלת אפיליאציה": "#10B981",
  "מתנות לייב": "#F59E0B",
  "מכירת קורס": "#8B5CF6",
  "אחר": "#6B7280",
};

const HEB_MONTHS: Record<number, string> = {
  1: "ינו׳", 2: "פבר׳", 3: "מרץ", 4: "אפר׳", 5: "מאי", 6: "יוני",
  7: "יולי", 8: "אוג׳", 9: "ספט׳", 10: "אוק׳", 11: "נוב׳", 12: "דצמ׳",
};

interface IncomeEntry {
  id: number;
  type: string;
  source: string;
  amount: number;
  platform: string;
  date: string;
  notes: string | null;
  created_at: string;
}

const emptyForm = {
  type: "ספונסר",
  source: "",
  amount: "",
  platform: "Instagram",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

type SortKey = "date" | "amount";

function IncomeContent() {
  const { data: session } = useSession();
  const router = useRouter();

  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/income");
      const data = await res.json();
      if (res.ok) setEntries(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const handleSubmit = async () => {
    setFormError("");
    if (!form.source.trim()) { setFormError("יש להכניס שם מקור"); return; }
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setFormError("יש להכניס סכום תקין"); return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: Number(form.amount) }),
      });
      if (!res.ok) { const d = await res.json(); setFormError(d.error); return; }
      setForm(emptyForm);
      setShowForm(false);
      fetchEntries();
    } catch {
      setFormError("שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch("/api/income", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleExportCSV = () => {
    const header = "תאריך,סוג,מקור,סכום,פלטפורמה,הערות";
    const rows = entries.map((e) =>
      [e.date, e.type, e.source, e.amount, e.platform, e.notes || ""].join(",")
    );
    const csv = "\uFEFF" + [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "הכנסות_ViewIL.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisYear = `${now.getFullYear()}`;

  const totalMonth = entries.filter((e) => e.date.startsWith(thisMonth)).reduce((s, e) => s + e.amount, 0);
  const totalYear = entries.filter((e) => e.date.startsWith(thisYear)).reduce((s, e) => s + e.amount, 0);
  const avgDeal = entries.length ? entries.reduce((s, e) => s + e.amount, 0) / entries.length : 0;

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const total = entries.filter((e) => e.date.startsWith(key)).reduce((s, e) => s + e.amount, 0);
    return { name: HEB_MONTHS[d.getMonth() + 1], total };
  });

  const byType = INCOME_TYPES.map((type) => ({
    name: type,
    value: entries.filter((e) => e.type === type).reduce((s, e) => s + e.amount, 0),
  })).filter((d) => d.value > 0);

  const sorted = [...entries].sort((a, b) => {
    const av = sortKey === "amount" ? a.amount : new Date(a.date).getTime();
    const bv = sortKey === "amount" ? b.amount : new Date(b.date).getTime();
    return sortAsc ? av - bv : bv - av;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(false); }
  };

  const fmt = (n: number) => `₪${n.toLocaleString("he-IL", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Sidebar
        activeTool="income"
        onSelectTool={() => router.push("/studio")}
        userName={session?.user?.name}
        userEmail={session?.user?.email}
        userImage={session?.user?.image}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar />
        <header className="hidden md:flex bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10 shadow-sm items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">ניהול הכנסות</h1>
            <p className="text-xs text-gray-400">עקוב אחרי כל הכנסות היוצר שלך</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={entries.length === 0}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl transition disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              ייצא לאקסל
            </button>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition"
            >
              <PlusCircle className="w-4 h-4" />
              הוסף הכנסה
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 flex flex-col gap-6 max-w-6xl w-full">
          {showForm && (
            <div className="bg-white border border-blue-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                הוסף הכנסה חדשה
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">סוג הכנסה</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {INCOME_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">שם המותג / מקור</label>
                  <input
                    type="text"
                    value={form.source}
                    onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                    placeholder="לדוגמה: Nike Israel"
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">סכום (₪)</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    placeholder="0"
                    min="0"
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">פלטפורמה</label>
                  <select
                    value={form.platform}
                    onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">תאריך</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">הערות (אופציונלי)</label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="הערה קצרה..."
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {formError && <p className="text-xs text-red-500">{formError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold text-sm rounded-xl transition"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  שמור הכנסה
                </button>
                <button
                  onClick={() => { setShowForm(false); setFormError(""); }}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl transition"
                >
                  ביטול
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "סה״כ החודש", value: fmt(totalMonth), icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "סה״כ השנה", value: fmt(totalYear), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
              { label: "ממוצע לעסקה", value: fmt(avgDeal), icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "מספר עסקאות", value: entries.length.toString(), icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                  <p className="text-xl font-extrabold text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {entries.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="font-bold text-gray-700 mb-4 text-sm">הכנסות חודשיות — 6 חודשים אחרונים</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData} barSize={28}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₪${v}`} />
                    <Tooltip
                      formatter={(value) => [`₪${Number(value).toLocaleString("he-IL")}`, "הכנסה"]}
                      contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 13 }}
                    />
                    <Bar dataKey="total" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="font-bold text-gray-700 mb-4 text-sm">פילוח לפי סוג הכנסה</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={byType}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={72}
                      innerRadius={36}
                    >
                      {byType.map((entry) => (
                        <Cell key={entry.name} fill={TYPE_COLORS[entry.name] || "#6B7280"} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`₪${Number(value).toLocaleString("he-IL")}`, ""]}
                      contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 13 }}
                    />
                    <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ fontSize: 12, color: "#374151" }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-700">כל העסקאות</h3>
              {entries.length > 0 && (
                <p className="text-xs text-gray-400">{entries.length} עסקאות</p>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <div className="text-4xl mb-3">💰</div>
                <p className="font-medium text-sm">אין עסקאות עדיין</p>
                <p className="text-xs mt-1">לחץ על &quot;הוסף הכנסה&quot; להתחיל</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th
                        className="px-5 py-3 text-right text-xs font-semibold text-gray-500 cursor-pointer hover:text-gray-700 select-none"
                        onClick={() => toggleSort("date")}
                      >
                        תאריך {sortKey === "date" ? (sortAsc ? "↑" : "↓") : ""}
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">סוג</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">מקור</th>
                      <th
                        className="px-5 py-3 text-right text-xs font-semibold text-gray-500 cursor-pointer hover:text-gray-700 select-none"
                        onClick={() => toggleSort("amount")}
                      >
                        סכום {sortKey === "amount" ? (sortAsc ? "↑" : "↓") : ""}
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">פלטפורמה</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">הערות</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((entry, i) => (
                      <tr key={entry.id} className={`border-b border-gray-50 hover:bg-gray-50 transition ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                        <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{entry.date}</td>
                        <td className="px-5 py-3">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{
                              background: (TYPE_COLORS[entry.type] || "#6B7280") + "18",
                              color: TYPE_COLORS[entry.type] || "#6B7280",
                            }}
                          >
                            {entry.type}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-800 font-medium">{entry.source}</td>
                        <td className="px-5 py-3 font-bold text-gray-900">{fmt(entry.amount)}</td>
                        <td className="px-5 py-3 text-gray-500">{entry.platform}</td>
                        <td className="px-5 py-3 text-gray-400 text-xs max-w-32 truncate">{entry.notes || "—"}</td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function IncomePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoaderIcon className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <IncomeContent />
    </Suspense>
  );
}
