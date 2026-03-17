"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Loader2,
  Trash2,
  ExternalLink,
  Calendar,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentProject {
  id: number;
  title: string;
  platform: string; // "tiktok" | "instagram" | "youtube"
  stage: string;    // "idea" | "script" | "filming" | "editing" | "caption" | "published"
  priority: string; // "high" | "medium" | "low"
  dueDate: string | null;
  notes: string | null;
  checklist: Record<string, boolean> | null;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  onSelectTool: (id: string) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGES = [
  { id: "idea",      label: "💡 רעיון",    color: "border-yellow-300 bg-yellow-50" },
  { id: "script",    label: "✍️ סקריפט",   color: "border-blue-300 bg-blue-50" },
  { id: "filming",   label: "🎬 צילום",    color: "border-purple-300 bg-purple-50" },
  { id: "editing",   label: "✂️ עריכה",    color: "border-orange-300 bg-orange-50" },
  { id: "caption",   label: "📝 קפשן",     color: "border-pink-300 bg-pink-50" },
  { id: "published", label: "✅ פורסם",    color: "border-green-300 bg-green-50" },
];

const STAGE_CHECKLISTS: Record<string, string[]> = {
  idea:      ["רעיון מוגדר", "קהל יעד ברור", "מטרה ברורה"],
  script:    ["סקריפט כתוב", "הוק חזק", "CTA מוגדר"],
  filming:   ["תאורה מוכנה", "לוקיישן מוכן", "תסריט מודפס"],
  editing:   ["חתכים נקיים", "מוזיקת רקע", "כתוביות נוספו"],
  caption:   ["קפשן כתוב", "האשטאגים נוספו", "תזמון נקבע"],
  published: ["פורסם בכל הפלטפורמות", "תגובות נוטרו", "ביצועים נרשמו"],
};

const PLATFORM_COLORS: Record<string, string> = {
  tiktok:    "bg-pink-100 text-pink-700",
  instagram: "bg-purple-100 text-purple-700",
  youtube:   "bg-red-100 text-red-700",
};

const PLATFORM_LABELS: Record<string, string> = {
  tiktok:    "TikTok",
  instagram: "Instagram",
  youtube:   "YouTube",
};

const PRIORITY_COLORS: Record<string, string> = {
  high:   "bg-red-500",
  medium: "bg-amber-400",
  low:    "bg-green-500",
};

const PRIORITY_LABELS: Record<string, string> = {
  high:   "גבוהה",
  medium: "בינונית",
  low:    "נמוכה",
};

const STAGE_LABELS: Record<string, string> = Object.fromEntries(
  STAGES.map((s) => [s.id, s.label])
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function checklistProgress(
  project: ContentProject
): { done: number; total: number } {
  const items = STAGE_CHECKLISTS[project.stage] ?? [];
  const total = items.length;
  const done = items.filter((item) => project.checklist?.[item] === true).length;
  return { done, total };
}

function priorityOrder(p: string): number {
  return p === "high" ? 0 : p === "medium" ? 1 : 2;
}

function sortProjects(projects: ContentProject[]): ContentProject[] {
  return [...projects].sort((a, b) => {
    const po = priorityOrder(a.priority) - priorityOrder(b.priority);
    if (po !== 0) return po;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function apiGet(): Promise<ContentProject[]> {
  const res = await fetch("/api/progress");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

async function apiCreate(data: Partial<ContentProject>): Promise<ContentProject> {
  const res = await fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create");
  return res.json();
}

async function apiUpdate(id: number, data: Partial<ContentProject>): Promise<ContentProject> {
  const res = await fetch(`/api/progress/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update");
  return res.json();
}

async function apiDelete(id: number): Promise<void> {
  const res = await fetch(`/api/progress/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{done}/{total} משימות</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Draggable Card ───────────────────────────────────────────────────────────

function DraggableCard({
  project,
  onClick,
  ghost,
}: {
  project: ContentProject;
  onClick: () => void;
  ghost?: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: project.id,
  });

  const overdue = isOverdue(project.dueDate);
  const { done, total } = checklistProgress(project);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => {
        // Only open panel if not dragging
        if (!isDragging) onClick();
      }}
      className={[
        "bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing select-none",
        overdue ? "border-r-4 border-r-red-400" : "",
        isDragging || ghost ? "opacity-40" : "opacity-100",
        "hover:shadow-md transition-shadow",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            PLATFORM_COLORS[project.platform] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {PLATFORM_LABELS[project.platform] ?? project.platform}
        </span>
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            PRIORITY_COLORS[project.priority] ?? "bg-gray-300"
          }`}
          title={PRIORITY_LABELS[project.priority]}
        />
      </div>

      <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-1">
        {project.title}
      </p>

      {project.dueDate && (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(project.dueDate)}</span>
          {overdue && (
            <span className="mr-1 text-red-500 font-semibold flex items-center gap-0.5">
              <AlertCircle className="w-3 h-3" /> באיחור
            </span>
          )}
        </div>
      )}

      <ProgressBar done={done} total={total} />
    </div>
  );
}

// ─── Ghost card for DragOverlay ───────────────────────────────────────────────

function GhostCard({ project }: { project: ContentProject }) {
  const overdue = isOverdue(project.dueDate);
  const { done, total } = checklistProgress(project);
  return (
    <div
      className={[
        "bg-white rounded-xl p-3 shadow-2xl border border-gray-100 w-72 rotate-2 opacity-95",
        overdue ? "border-r-4 border-r-red-400" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            PLATFORM_COLORS[project.platform] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {PLATFORM_LABELS[project.platform] ?? project.platform}
        </span>
        <span
          className={`w-2.5 h-2.5 rounded-full ${PRIORITY_COLORS[project.priority] ?? "bg-gray-300"}`}
        />
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-1">
        {project.title}
      </p>
      {project.dueDate && (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(project.dueDate)}</span>
        </div>
      )}
      <ProgressBar done={done} total={total} />
    </div>
  );
}

// ─── Droppable Column ─────────────────────────────────────────────────────────

function DroppableColumn({
  stage,
  projects,
  onCardClick,
  activeId,
}: {
  stage: (typeof STAGES)[number];
  projects: ContentProject[];
  onCardClick: (p: ContentProject) => void;
  activeId: number | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <div
      ref={setNodeRef}
      className={[
        "w-72 shrink-0 md:w-72 rounded-2xl border-2 flex flex-col",
        stage.color,
        isOver ? "ring-2 ring-blue-400 ring-offset-1" : "",
      ].join(" ")}
    >
      {/* Column header */}
      <div className="px-3 py-2.5 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-700">{stage.label}</span>
        <span className="bg-white text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
          {projects.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 px-2 pb-3 flex flex-col gap-2 min-h-[120px]">
        {sortProjects(projects).map((p) => (
          <DraggableCard
            key={p.id}
            project={p}
            onClick={() => onCardClick(p)}
            ghost={p.id === activeId}
          />
        ))}
        {projects.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-xs text-gray-400 italic py-6">
            גרור כאן
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Side Panel ───────────────────────────────────────────────────────────────

function SidePanel({
  project,
  onClose,
  onUpdate,
  onDelete,
  onSelectTool,
}: {
  project: ContentProject;
  onClose: () => void;
  onUpdate: (id: number, data: Partial<ContentProject>) => Promise<void>;
  onDelete: (id: number) => void;
  onSelectTool: (id: string) => void;
}) {
  const [local, setLocal] = useState<ContentProject>(project);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync when project prop changes (e.g. stage drop from board)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setLocal(project);
    setConfirmDelete(false);
  }, [project.id]);

  const save = useCallback(
    async (patch: Partial<ContentProject>) => {
      try {
        await onUpdate(project.id, patch);
      } catch (e) {
        console.error(e);
      }
    },
    [project.id, onUpdate]
  );

  const handleField = (
    field: keyof ContentProject,
    value: string | null
  ) => {
    const updated = { ...local, [field]: value } as ContentProject;
    setLocal(updated);
    save({ [field]: value });
  };

  const handleNotes = (value: string) => {
    setLocal((prev) => ({ ...prev, notes: value }));
    if (notesTimer.current) clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => {
      save({ notes: value });
    }, 1000);
  };

  const handleCheckbox = (item: string, checked: boolean) => {
    const currentChecklist = local.checklist ?? {};
    const updatedChecklist = { ...currentChecklist, [item]: checked };
    setLocal((prev) => ({ ...prev, checklist: updatedChecklist }));
    save({ checklist: updatedChecklist });
  };

  const checklistItems = STAGE_CHECKLISTS[local.stage] ?? [];
  const checklistDone = checklistItems.filter(
    (item) => local.checklist?.[item] === true
  ).length;

  return (
    <>
      {/* Backdrop on mobile */}
      <div
        className="fixed inset-0 bg-black/30 z-40 md:hidden"
        onClick={onClose}
      />

      <motion.aside
        dir="rtl"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full md:w-[380px] bg-white shadow-2xl z-50 flex flex-col overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold text-gray-800 truncate ml-2">
            {local.title || "פרויקט ללא שם"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition rounded-lg p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-5 py-4 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              כותרת
            </label>
            <input
              type="text"
              value={local.title}
              onChange={(e) => setLocal((p) => ({ ...p, title: e.target.value }))}
              onBlur={(e) => save({ title: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              dir="rtl"
            />
          </div>

          {/* Platform + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                פלטפורמה
              </label>
              <select
                value={local.platform}
                onChange={(e) => handleField("platform", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                dir="rtl"
              >
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                עדיפות
              </label>
              <select
                value={local.priority}
                onChange={(e) => handleField("priority", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                dir="rtl"
              >
                <option value="high">גבוהה</option>
                <option value="medium">בינונית</option>
                <option value="low">נמוכה</option>
              </select>
            </div>
          </div>

          {/* Due date + Stage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                תאריך יעד
              </label>
              <input
                type="date"
                value={local.dueDate ? local.dueDate.substring(0, 10) : ""}
                onChange={(e) =>
                  handleField("dueDate", e.target.value || null)
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                שלב
              </label>
              <select
                value={local.stage}
                onChange={(e) => handleField("stage", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                dir="rtl"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              הערות
            </label>
            <textarea
              value={local.notes ?? ""}
              onChange={(e) => handleNotes(e.target.value)}
              rows={3}
              placeholder="הוסף הערות לפרויקט..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              dir="rtl"
            />
          </div>

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500">
                צ&apos;קליסט &ndash; {STAGE_LABELS[local.stage]}
              </label>
              <span className="text-xs text-gray-400">
                {checklistDone}/{checklistItems.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width:
                    checklistItems.length === 0
                      ? "0%"
                      : `${Math.round((checklistDone / checklistItems.length) * 100)}%`,
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              {checklistItems.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={local.checklist?.[item] === true}
                    onChange={(e) => handleCheckbox(item, e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  />
                  <span
                    className={`text-sm ${
                      local.checklist?.[item]
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">קישורים מהירים</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onSelectTool("script")}
                className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 transition px-3 py-2 rounded-lg font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                ✍️ צור סקריפט לתוכן זה
              </button>
              <button
                onClick={() => onSelectTool("hooks")}
                className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 transition px-3 py-2 rounded-lg font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                🎣 צור הוקים לתוכן זה
              </button>
            </div>
          </div>
        </div>

        {/* Footer – delete */}
        <div className="px-5 py-4 border-t border-gray-100 sticky bottom-0 bg-white">
          {confirmDelete ? (
            <div className="flex gap-2">
              <button
                onClick={() => onDelete(project.id)}
                className="flex-1 bg-red-600 text-white text-sm font-bold rounded-lg py-2 hover:bg-red-700 transition"
              >
                אשר מחיקה
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 border border-gray-200 text-sm font-medium rounded-lg py-2 hover:bg-gray-50 transition"
              >
                ביטול
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full flex items-center justify-center gap-2 text-red-500 border border-red-200 text-sm font-semibold rounded-lg py-2 hover:bg-red-50 transition"
            >
              <Trash2 className="w-4 h-4" />
              מחק פרויקט
            </button>
          )}
        </div>
      </motion.aside>
    </>
  );
}

// ─── Add Project Modal ────────────────────────────────────────────────────────

function AddProjectModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: Partial<ContentProject>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    title: "",
    platform: "tiktok",
    priority: "medium",
    stage: "idea",
    dueDate: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onCreate({
        title: form.title.trim(),
        platform: form.platform,
        priority: form.priority,
        stage: form.stage,
        dueDate: form.dueDate || null,
        notes: null,
        checklist: null,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        dir="rtl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">הוסף תוכן חדש</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              כותרת הפרויקט *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="לדוגמה: וידאו על 5 טיפים לצמיחה"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              dir="rtl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                פלטפורמה
              </label>
              <select
                value={form.platform}
                onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                dir="rtl"
              >
                <option value="tiktok">TikTok</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                עדיפות
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                dir="rtl"
              >
                <option value="high">גבוהה</option>
                <option value="medium">בינונית</option>
                <option value="low">נמוכה</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                שלב התחלתי
              </label>
              <select
                value={form.stage}
                onChange={(e) => setForm((p) => ({ ...p, stage: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                dir="rtl"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                תאריך יעד
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white text-sm font-bold rounded-xl py-2.5 hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              שמור
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-sm font-medium rounded-xl py-2.5 hover:bg-gray-50 transition"
            >
              ביטול
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ projects }: { projects: ContentProject[] }) {
  const inProgress = projects.filter((p) => p.stage !== "published").length;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const completedThisMonth = projects.filter(
    (p) =>
      p.stage === "published" &&
      p.updatedAt >= monthStart
  ).length;

  const withDue = projects
    .filter((p) => p.dueDate && p.stage !== "published")
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1));
  const nearestTitle = withDue[0]?.title ?? "—";

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      <div className="bg-blue-50 rounded-2xl px-4 py-3 text-center border border-blue-100">
        <p className="text-2xl font-black text-blue-700">{inProgress}</p>
        <p className="text-xs text-blue-500 font-medium mt-0.5">תכנים בתהליך</p>
      </div>
      <div className="bg-green-50 rounded-2xl px-4 py-3 text-center border border-green-100">
        <p className="text-2xl font-black text-green-700">{completedThisMonth}</p>
        <p className="text-xs text-green-500 font-medium mt-0.5">הושלמו החודש</p>
      </div>
      <div className="bg-amber-50 rounded-2xl px-4 py-3 text-center border border-amber-100">
        <p
          className="text-sm font-bold text-amber-700 truncate"
          title={nearestTitle}
        >
          {nearestTitle}
        </p>
        <p className="text-xs text-amber-500 font-medium mt-0.5">קרוב לתאריך יעד</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContentProgressManager({ onSelectTool }: Props) {
  const [projects, setProjects] = useState<ContentProject[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ContentProject | null>(null);

  const [activeId, setActiveId] = useState<number | null>(null);

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet();
        setProjects(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Mutations ─────────────────────────────────────────────────────────────

  const handleCreate = async (data: Partial<ContentProject>) => {
    const created = await apiCreate(data);
    setProjects((prev) => [...prev, created]);
  };

  const handleUpdate = useCallback(
    async (id: number, data: Partial<ContentProject>) => {
      try {
        const updated = await apiUpdate(id, data);
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? updated : p))
        );
        setSelectedProject((prev) =>
          prev?.id === id ? updated : prev
        );
      } catch (e) {
        console.error(e);
      }
    },
    []
  );

  const handleDelete = async (id: number) => {
    try {
      await apiDelete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setSelectedProject(null);
    } catch (e) {
      console.error(e);
    }
  };

  // ── Drag and Drop ─────────────────────────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const projectId = active.id as number;
    const newStage = over.id as string;
    const project = projects.find((p) => p.id === projectId);
    if (!project || project.stage === newStage) return;
    // Optimistically update
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, stage: newStage } : p
      )
    );
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) => prev ? { ...prev, stage: newStage } : prev);
    }
    await handleUpdate(projectId, { stage: newStage });
  };

  // ── Filtered projects ─────────────────────────────────────────────────────

  const filtered = projects.filter((p) => {
    if (filterPlatform !== "all" && p.platform !== filterPlatform) return false;
    if (filterPriority !== "all" && p.priority !== filterPriority) return false;
    return true;
  });

  const activeProject = activeId
    ? projects.find((p) => p.id === activeId) ?? null
    : null;

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" dir="rtl">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="mr-3 text-gray-500 text-sm">טוען פרויקטים...</span>
      </div>
    );
  }

  return (
    <div dir="rtl" className="w-full h-full flex flex-col">
      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-800">ניהול תוכן</h1>
          <p className="text-xs text-gray-400 mt-0.5">גרור כרטיסים בין עמודות לעדכון שלב</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          הוסף תוכן חדש
        </button>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      {projects.length > 0 && <StatsBar projects={projects} />}

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs font-semibold text-gray-500">סנן:</span>

        <div className="flex items-center gap-1">
          {["all", "tiktok", "instagram", "youtube"].map((v) => (
            <button
              key={v}
              onClick={() => setFilterPlatform(v)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                filterPlatform === v
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {v === "all" ? "הכל" : PLATFORM_LABELS[v]}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-gray-200 mx-1" />

        <div className="flex items-center gap-1">
          {["all", "high", "medium", "low"].map((v) => (
            <button
              key={v}
              onClick={() => setFilterPriority(v)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                filterPriority === v
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {v === "all" ? "כל עדיפות" : PRIORITY_LABELS[v]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {projects.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">אין תכנים עדיין</h3>
          <p className="text-gray-400 mb-6">התחל לנהל את תהליך יצירת התוכן שלך</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition"
          >
            צור את הפרויקט הראשון שלך
          </button>
        </div>
      ) : (
        /* ── Kanban Board ─────────────────────────────────────────────── */
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto pb-4 -mx-2 px-2">
            <div className="flex gap-3 w-max min-h-[60vh]">
              {STAGES.map((stage) => (
                <DroppableColumn
                  key={stage.id}
                  stage={stage}
                  projects={filtered.filter((p) => p.stage === stage.id)}
                  onCardClick={(p) => setSelectedProject(p)}
                  activeId={activeId}
                />
              ))}
            </div>
          </div>

          {/* DragOverlay */}
          <DragOverlay dropAnimation={null}>
            {activeProject ? <GhostCard project={activeProject} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* ── Modals & panels ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <AddProjectModal
            key="add-modal"
            onClose={() => setShowModal(false)}
            onCreate={handleCreate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <SidePanel
            key={`panel-${selectedProject.id}`}
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onSelectTool={onSelectTool}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
