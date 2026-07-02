"use client";

import { useState, useEffect, useCallback } from "react";

type Anniversary = {
  id: string;
  title: string;
  date: string;
  description?: string;
};

function getCountdown(dateStr: string) {
  const now = new Date();
  const target = new Date(dateStr);
  const thisYear = new Date(target);
  thisYear.setFullYear(now.getFullYear());

  if (thisYear < now) thisYear.setFullYear(now.getFullYear() + 1);

  const diff = thisYear.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getDaysTogether(dateStr: string) {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export default function AnniversaryList() {
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const fetchAnniversaries = useCallback(async () => {
    const res = await fetch("/api/anniversaries");
    setAnniversaries(await res.json());
  }, []);

  useEffect(() => {
    fetchAnniversaries();
  }, [fetchAnniversaries]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/anniversaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date, description }),
    });
    setTitle("");
    setDate("");
    setDescription("");
    setShowForm(false);
    fetchAnniversaries();
  }

  const togetherId = anniversaries.find((a) => a.title === "在一起纪念日");

  return (
    <div className="space-y-4">
      {togetherId && (
        <div className="farm-hero p-6 text-center">
          <p className="text-sm font-bold text-[#fff2cc]">我们已经在一起</p>
          <p className="my-1 text-5xl font-black">{getDaysTogether(togetherId.date)}</p>
          <p className="text-sm font-bold text-[#fff2cc]">天了 ❤️</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="farm-title text-lg">纪念日日历</h2>
          <p className="farm-muted text-xs">重要日子都种在这里</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="pixel-button px-3 py-1.5 text-sm">
          + 添加
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="pixel-panel p-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="纪念日名称"
            required
            className="pixel-input px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="pixel-input px-3 py-2 text-sm"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="备注（可选）"
            className="pixel-input px-3 py-2 text-sm"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="pixel-button pixel-button-secondary px-3 py-1.5 text-sm">
              取消
            </button>
            <button type="submit" className="pixel-button px-4 py-1.5 text-sm">
              添加
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {anniversaries.map((a) => {
          const countdown = getCountdown(a.date);
          return (
            <div key={a.id} className="pixel-panel-soft flex items-center justify-between p-4">
              <div className="min-w-0">
                <p className="truncate font-bold text-[#5e3822]">{a.title}</p>
                {a.description && <p className="farm-muted mt-0.5 truncate text-xs">{a.description}</p>}
                <p className="farm-muted mt-0.5 text-xs">{new Date(a.date).toLocaleDateString("zh-CN")}</p>
              </div>
              <div className="ml-3 text-right">
                <p className="text-2xl font-black text-[#4f8b3b]">{countdown}</p>
                <p className="farm-muted text-xs">天后</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
