"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Album = {
  id: string;
  name: string;
  description?: string;
  _count: { media: number };
  media: { url: string; type: string }[];
};

export default function AlbumList() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchAlbums = useCallback(async () => {
    const res = await fetch("/api/albums");
    setAlbums(await res.json());
  }, []);

  useEffect(() => { fetchAlbums(); }, [fetchAlbums]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    setName("");
    setDescription("");
    setShowForm(false);
    fetchAlbums();
  }

  async function handleDelete(albumId: string, e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm("确定要删除这个相册吗？相册内所有照片都会删除。")) return;
    await fetch(`/api/albums/${albumId}`, { method: "DELETE" });
    fetchAlbums();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">我们的相册 📷</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-rose-400 hover:bg-rose-500 text-white px-3 py-1.5 rounded-full text-sm transition-colors"
        >
          + 新建相册
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="相册名称"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-300"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="描述（可选）"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-300"
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 text-sm px-3 py-1.5">取消</button>
            <button type="submit" className="bg-rose-400 text-white px-4 py-1.5 rounded-full text-sm">创建</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 gap-3">
        {albums.map((album) => (
        <div key={album.id} className="relative">
          <Link href={`/albums/${album.id}`}>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 bg-rose-100 flex items-center justify-center overflow-hidden">
                {album.media[0] ? (
                  album.media[0].type === "video" ? (
                    <video src={album.media[0].url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={album.media[0].url} alt="" className="w-full h-full object-cover" />
                  )
                ) : (
                  <span className="text-4xl">📷</span>
                )}
              </div>
              <div className="p-3">
                <p className="font-medium text-gray-700 text-sm">{album.name}</p>
                <p className="text-xs text-gray-400">{album._count.media} 张</p>
              </div>
            </div>
          </Link>
          <button
            onClick={(e) => handleDelete(album.id, e)}
            className="absolute top-2 right-2 bg-black/40 hover:bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center transition-colors"
            title="删除相册"
          >×</button>
        </div>
        ))}
      </div>
    </div>
  );
}
