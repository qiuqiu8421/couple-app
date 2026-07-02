"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirm) {
      setError("两次输入的新密码不一致");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/user/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "修改失败");
    } else {
      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    }
  }

  return (
    <main className="farm-shell">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="pixel-button pixel-button-secondary px-3 py-1.5 text-sm">
          ← 返回
        </button>
        <div>
          <h1 className="farm-title text-lg">修改密码</h1>
          <p className="farm-muted text-xs">给小屋换一把新钥匙</p>
        </div>
      </div>

      <div className="pixel-panel p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-[#5e3822]">原密码</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="pixel-input px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-[#5e3822]">新密码</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pixel-input px-3 py-2"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-[#5e3822]">确认新密码</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="pixel-input px-3 py-2"
              required
            />
          </div>
          {error && <p className="text-sm font-bold text-red-500">{error}</p>}
          {success && <p className="text-sm font-bold text-green-700">密码修改成功！</p>}
          <button type="submit" disabled={loading} className="pixel-button w-full px-4 py-2">
            {loading ? "提交中..." : "确认修改"}
          </button>
        </form>
      </div>
    </main>
  );
}
