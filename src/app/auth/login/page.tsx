"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: "#0D0D0D" }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 hero-dots opacity-20" />

      {/* Gradient blobs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8758FF, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #5CB8E4, transparent 70%)" }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-sm rounded-3xl p-8 shadow-2xl fade-up"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8 fade-up-1">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8758FF, #5CB8E4)" }}
          >
            <span className="text-white text-2xl font-bold">ต</span>
          </div>
          <h1 className="text-xl font-bold text-white">ฐานข้อมูลกลางเมืองตาคลี</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            เข้าสู่ระบบเจ้าหน้าที่
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="px-4 py-3 rounded-xl text-sm mb-4"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#fca5a5",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 fade-up-2">
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              อีเมล
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all focus:ring-2 focus:ring-primary/50"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@takhlicity.go.th"
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              รหัสผ่าน
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all focus:ring-2 focus:ring-primary/50"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white transition-opacity hover:opacity-90 mt-2 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #8758FF, #5CB8E4)" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                กำลังเข้าสู่ระบบ...
              </>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
