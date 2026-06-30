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

  // Set to this year
  const thisYear = new Date(target);
  thisYear.setFullYear(now.getFullYear());

  // If already passed this year, use next year
  if (thisYear < now) thisYear.setFullYear(now.getFullYear() + 1);

  const diff = thisYear.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
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

  useEffect(() => { fetchAnniversaries(); }, [fetchAnniversaries]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/anniversaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, date, description }),
    });
    setTitle(""); setDate(""); setDescription("");
    setShowForm(false);
    fetchAnniversaries();
  }

  const togetherId = anniversaries.find(a => a.title === "在一起纪念日");

  return (
    <div className="space-y-4">
      {togetherId && (
        <div className="bg-rose-400 rounded-2xl p-6 text-white text-center">
          <p className="text-rose-100 text-sm mb-1">我们已经在一起</p>
          <p className="text-5xl font-bold mb-1">{getDaysTogether(togetherId.date)}</p>
          <p className="text-rose-100 text-sm">天了 💕</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">纪念日 💝</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-rose-400 hover:bg-rose-500 text-white px-3 py-1.5 rounded-full text-sm transition-colors"
        >
          + 添加
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="纪念日名称"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-300"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-300"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="备注（可选）"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-300"
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 text-sm px-3 py-1.5">取消</button>
            <button type="submit" className="bg-rose-400 text-white px-4 py-1.5 rounded-full text-sm">添加</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {anniversaries.map((a) => {
          const countdown = getCountdown(a.date);
          return (
            <div key={a.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">{a.title}</p>
                {a.description && <p className="text-xs text-gray-400 mt-0.5">{a.description}</p>}
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(a.date).toLocaleDateString("zh-CN")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-rose-400">{countdown}</p>
                <p className="text-xs text-gray-400">天后</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
