"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "@/components/studio/Sidebar";
import Link from "next/link";
import {
  Camera, Save, Lock, Instagram, CheckCircle, Crown,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const MAX_USERS = 1000;

interface ProfileData {
  name: string;
  email: string;
  avatar_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  plan: string;
  scripts_this_month: number;
}

function ProfileContent() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Profile settings form
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [nameError, setNameError] = useState("");

  // Avatar
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Social media
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [savingSocial, setSavingSocial] = useState(false);
  const [socialSaved, setSocialSaved] = useState(false);
  const [socialError, setSocialError] = useState("");

  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/user-count")
      .then((r) => r.json())
      .then((d) => setUserCount(d.count))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data: ProfileData) => {
        setProfile(data);
        setDisplayName(data.name || "");
        setInstagram(data.instagram_url || "");
        setTiktok(data.tiktok_url || "");
        setAvatarPreview(data.avatar_url || null);
      })
      .finally(() => setLoadingProfile(false));
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError("");

    const localUrl = URL.createObjectURL(file);
    setAvatarPreview(localUrl);

    setUploadingAvatar(true);
    const fd = new FormData();
    fd.append("avatar", file);

    try {
      const res = await fetch("/api/profile/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setAvatarError(data.error); setAvatarPreview(profile?.avatar_url || null); return; }
      setProfile((p) => p ? { ...p, avatar_url: data.avatar_url } : p);
      await updateSession({ image: data.avatar_url });
    } catch {
      setAvatarError("שגיאה בהעלאת התמונה");
      setAvatarPreview(profile?.avatar_url || null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveName = async () => {
    setNameError("");
    if (!displayName.trim()) { setNameError("יש להכניס שם תצוגה"); return; }
    setSavingName(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName }),
      });
      const data = await res.json();
      if (!res.ok) { setNameError(data.error); return; }
      setProfile((p) => p ? { ...p, name: displayName } : p);
      await updateSession({ name: displayName });
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 3000);
    } catch {
      setNameError("שגיאה בשמירה");
    } finally {
      setSavingName(false);
    }
  };

  const handleSavePassword = async () => {
    setPasswordError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("יש למלא את כל שדות הסיסמה"); return;
    }
    if (newPassword.length < 6) { setPasswordError("הסיסמה החדשה חייבת להכיל לפחות 6 תווים"); return; }
    if (newPassword !== confirmPassword) { setPasswordError("הסיסמאות החדשות אינן תואמות"); return; }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setPasswordError(data.error); return; }
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch {
      setPasswordError("שגיאה בשמירה");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSaveSocial = async () => {
    setSocialError("");
    setSavingSocial(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instagram_url: instagram, tiktok_url: tiktok }),
      });
      const data = await res.json();
      if (!res.ok) { setSocialError(data.error); return; }
      setProfile((p) => p ? { ...p, instagram_url: instagram || null, tiktok_url: tiktok || null } : p);
      setSocialSaved(true);
      setTimeout(() => setSocialSaved(false), 3000);
    } catch {
      setSocialError("שגיאה בשמירה");
    } finally {
      setSavingSocial(false);
    }
  };

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "יצ";

  const avatarUrl = avatarPreview || null;
  const userCountPct = userCount !== null ? Math.min(100, (userCount / MAX_USERS) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Sidebar
        activeTool="profile"
        onSelectTool={() => router.push("/home")}
        userName={session?.user?.name}
        userEmail={session?.user?.email}
        userImage={session?.user?.image}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10 shadow-sm">
          <h1 className="text-lg font-bold text-gray-800">הפרופיל שלי</h1>
          <p className="text-xs text-gray-400">ניהול חשבון והגדרות</p>
        </header>

        <main className="flex-1 p-6 max-w-3xl w-full flex flex-col gap-6">
          {loadingProfile ? (
            <div className="flex items-center justify-center py-24 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* ── Profile Settings ── */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-6">
                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  הגדרות פרופיל
                </h2>

                {/* Avatar */}
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {avatarUrl ? (
                        <Image src={avatarUrl} alt="תמונת פרופיל" width={80} height={80} className="object-cover w-full h-full" unoptimized />
                      ) : (
                        initials
                      )}
                    </div>
                    {uploadingAvatar && (
                      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center hover:bg-blue-700 transition"
                      title="שנה תמונה"
                    >
                      <Camera className="w-3.5 h-3.5 text-white" />
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{profile?.name}</p>
                    <p className="text-sm text-gray-400">{profile?.email}</p>
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="text-xs text-blue-600 hover:underline mt-1"
                    >
                      שנה תמונת פרופיל
                    </button>
                    {avatarError && <p className="text-xs text-red-500 mt-1">{avatarError}</p>}
                  </div>
                </div>

                {/* Display name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">שם תצוגה</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="השם שיוצג בסטודיו"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={savingName}
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition"
                    >
                      {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : nameSaved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      {nameSaved ? "נשמר!" : "שמור"}
                    </button>
                  </div>
                  {nameError && <p className="text-xs text-red-500">{nameError}</p>}
                </div>

                {/* Password */}
                <div className="border-t border-gray-100 pt-5 flex flex-col gap-3">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                    שינוי סיסמה
                  </h3>
                  <div className="flex flex-col gap-2">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="סיסמה נוכחית"
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="סיסמה חדשה (לפחות 6 תווים)"
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="אימות סיסמה חדשה"
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-500">{passwordError}</p>
                  )}
                  <button
                    onClick={handleSavePassword}
                    disabled={savingPassword}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition"
                  >
                    {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : passwordSaved ? <CheckCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    {passwordSaved ? "הסיסמה עודכנה!" : "עדכן סיסמה"}
                  </button>
                </div>
              </section>

              {/* ── Social Media ── */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-pink-500" />
                  רשתות חברתיות
                </h2>

                <div className="flex flex-col gap-4">
                  {/* Instagram */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        📸 אינסטגרם
                      </label>
                      {profile?.instagram_url && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> מחובר
                        </span>
                      )}
                    </div>
                    <input
                      type="url"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://www.instagram.com/yourprofile"
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      dir="ltr"
                    />
                  </div>

                  {/* TikTok */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        🎵 TikTok
                      </label>
                      {profile?.tiktok_url && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> מחובר
                        </span>
                      )}
                    </div>
                    <input
                      type="url"
                      value={tiktok}
                      onChange={(e) => setTiktok(e.target.value)}
                      placeholder="https://www.tiktok.com/@yourprofile"
                      className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      dir="ltr"
                    />
                  </div>
                </div>

                {socialError && <p className="text-xs text-red-500">{socialError}</p>}

                <button
                  onClick={handleSaveSocial}
                  disabled={savingSocial}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-semibold rounded-xl transition"
                >
                  {savingSocial ? <Loader2 className="w-4 h-4 animate-spin" /> : socialSaved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {socialSaved ? "נשמר!" : "שמור רשתות חברתיות"}
                </button>
              </section>

              {/* ── My Plan ── */}
              <section className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
                <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  הפלן שלי
                </h2>

                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white relative overflow-hidden">
                  <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/5 blur-xl pointer-events-none" />

                  <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    🎉 גישה מוקדמת — חינם לחלוטין
                  </span>

                  <p className="text-white/90 text-sm leading-relaxed mb-4">
                    ViewIL בחינם לגמרי עד 1,000 המשתמשים הראשונים. אתה אחד מהם!
                  </p>

                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/75">משתמשים שהצטרפו</span>
                      <span className="text-xs font-bold text-white">
                        {userCount !== null ? userCount : "..."} / {MAX_USERS.toLocaleString("he-IL")} משתמשים
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-white transition-all duration-700"
                        style={{ width: `${userCountPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Legal links */}
          <div className="pt-2 pb-4 text-center text-xs text-gray-400 flex items-center justify-center gap-3">
            <Link href="/tos" className="hover:text-blue-600 transition-colors">
              תנאי שימוש
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              מדיניות פרטיות
            </Link>
          </div>
        </main>
      </div>

    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
