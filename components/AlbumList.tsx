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

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

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
        <div>
          <h2 className="farm-title text-lg">相册谷仓</h2>
          <p className="farm-muted text-xs">把照片收进小木箱</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="pixel-button px-3 py-1.5 text-sm">
          + 新建相册
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="pixel-panel p-4 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="相册名称"
            required
            className="pixel-input px-3 py-2 text-sm"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="描述（可选）"
            className="pixel-input px-3 py-2 text-sm"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="pixel-button pixel-button-secondary px-3 py-1.5 text-sm">
              取消
            </button>
            <button type="submit" className="pixel-button px-4 py-1.5 text-sm">
              创建
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 gap-3">
        {albums.map((album) => (
          <div key={album.id} className="relative">
            <Link href={`/albums/${album.id}`}>
              <div className="pixel-panel-soft overflow-hidden transition-transform hover:-translate-y-0.5">
                <div className="pixel-media-tile flex h-32 items-center justify-center overflow-hidden border-0">
                  {album.media[0] ? (
                    album.media[0].type === "video" ? (
                      <video src={album.media[0].url} className="h-full w-full object-cover" />
                    ) : (
                      <img src={album.media[0].url} alt="" className="h-full w-full object-cover" />
                    )
                  ) : (
                    <span className="text-4xl">🧺</span>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-bold text-[#5e3822]">{album.name}</p>
                  <p className="farm-muted text-xs">{album._count.media} 张</p>
                </div>
              </div>
            </Link>
            <button
              onClick={(e) => handleDelete(album.id, e)}
              className="pixel-button pixel-button-danger absolute right-2 top-2 h-6 w-6 text-sm"
              title="删除相册"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
