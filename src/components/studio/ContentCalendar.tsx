"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Lock, X } from "lucide-react";

const HEBREW_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

const HEBREW_DAYS = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

// Jewish holidays (approximate Gregorian dates for 2025-2026)
const JEWISH_HOLIDAYS: Record<string, string> = {
  "2025-10-02": "ראש השנה",
  "2025-10-03": "ראש השנה",
  "2025-10-11": "יום כיפור",
  "2025-10-16": "סוכות",
  "2025-10-23": "שמחת תורה",
  "2025-12-25": "חנוכה",
  "2026-03-13": "פורים",
  "2026-04-01": "פסח",
  "2026-04-02": "פסח",
  "2026-05-21": "שבועות",
};

interface Post {
  id: string;
  date: string;
  title: string;
  platform: string;
  notes: string;
  color: string;
}

interface ModalData {
  date: string;
  post?: Post;
}

const PLATFORM_COLORS: Record<string, string> = {
  tiktok: "bg-pink-500",
  instagram: "bg-purple-500",
  youtube: "bg-red-500",
  facebook: "bg-blue-500",
};

export default function ContentCalendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [posts, setPosts] = useState<Post[]>([]);
  const [modal, setModal] = useState<ModalData | null>(null);
  const [formData, setFormData] = useState({ title: "", platform: "instagram", notes: "" });

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay(); // 0=Sun
    return day; // Sun=0, Mon=1, ..., Sat=6
  };

  const isShabbat = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day).getDay();
    return d === 5 || d === 6; // Friday or Saturday
  };

  const getHoliday = (year: number, month: number, day: number) => {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return JEWISH_HOLIDAYS[key];
  };

  const getPostsForDay = (year: number, month: number, day: number) => {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return posts.filter((p) => p.date === key);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setModal({ date: dateStr });
    setFormData({ title: "", platform: "instagram", notes: "" });
  };

  const handleSavePost = () => {
    if (!modal || !formData.title.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      date: modal.date,
      title: formData.title,
      platform: formData.platform,
      notes: formData.notes,
      color: PLATFORM_COLORS[formData.platform] || "bg-blue-500",
    };
    setPosts((prev) => [...prev, newPost]);
    setModal(null);
  };

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Build calendar grid (Sun-Sat)
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">לוח תוכן</h2>
        <p className="text-sm text-gray-500">לחץ על יום כדי להוסיף פוסט מתוכנן</p>
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ChevronRight className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-gray-800">
            {HEBREW_MONTHS[currentMonth]} {currentYear}
          </h3>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-xs text-gray-500 mb-3 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-gray-200 rounded-sm inline-block" /> שבת/יום שישי
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-amber-100 rounded-sm inline-block" /> חג יהודי
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-pink-500 rounded-full inline-block" /> TikTok
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-purple-500 rounded-full inline-block" /> אינסטגרם
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 rounded-full inline-block" /> יוטיוב
          </span>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {HEBREW_DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-bold text-gray-500 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, idx) => {
            if (!day) return <div key={idx} />;
            const shabbat = isShabbat(currentYear, currentMonth, day);
            const holiday = getHoliday(currentYear, currentMonth, day);
            const dayPosts = getPostsForDay(currentYear, currentMonth, day);
            const todayMark = isToday(day);

            return (
              <div
                key={idx}
                onClick={() => handleDayClick(day)}
                className={`relative min-h-16 p-1 rounded-lg cursor-pointer border transition hover:border-blue-300 hover:bg-blue-50/50 ${
                  shabbat ? "bg-gray-100 border-gray-200" : "bg-white border-gray-100"
                } ${holiday ? "bg-amber-50 border-amber-200" : ""} ${
                  todayMark ? "border-blue-500 border-2" : ""
                }`}
              >
                <div className={`text-xs font-bold mb-1 text-center ${todayMark ? "text-blue-600" : shabbat ? "text-gray-400" : "text-gray-700"}`}>
                  {day}
                </div>
                {shabbat && (
                  <div className="flex justify-center">
                    <Lock className="w-3 h-3 text-gray-400" />
                  </div>
                )}
                {holiday && (
                  <div className="text-center">
                    <span className="text-amber-600 text-xs leading-none">{holiday}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-0.5 justify-center mt-1">
                  {dayPosts.map((post) => (
                    <div
                      key={post.id}
                      className={`w-2 h-2 rounded-full ${post.color} cursor-pointer`}
                      title={post.title}
                      onClick={(e) => handleDeletePost(post.id, e)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">הוסף פוסט — {modal.date}</h3>
              <button onClick={() => setModal(null)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">כותרת הפוסט</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                  placeholder="לדוגמה: 5 טיפים לצמיחה"
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">פלטפורמה</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData((f) => ({ ...f, platform: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="instagram">📸 אינסטגרם</option>
                  <option value="tiktok">🎵 TikTok</option>
                  <option value="youtube">▶️ יוטיוב</option>
                  <option value="facebook">👥 פייסבוק</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">הערות</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="הערות נוספות..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSavePost}
                  disabled={!formData.title.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition"
                >
                  שמור פוסט
                </button>
                <button
                  onClick={() => setModal(null)}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
