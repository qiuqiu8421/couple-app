"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

type MediaItem = { id: string; url: string; type: string; caption?: string };
type Album = { id: string; name: string; description?: string; media: MediaItem[] };

export default function AlbumDetail({ albumId }: { albumId: string }) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchAlbum = useCallback(async () => {
    const res = await fetch(`/api/albums/${albumId}`);
    setAlbum(await res.json());
  }, [albumId]);

  useEffect(() => { fetchAlbum(); }, [fetchAlbum]);

  async function handleUpload(files: FileList) {
    setUploading(true);
    setUploadProgress({ done: 0, total: files.length });

    // 并行上传所有文件
    const uploaded = await Promise.all(
      Array.from(files).map(async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        const result = await uploadRes.json() as { url: string; type: string };
        setUploadProgress((prev) => ({ ...prev, done: prev.done + 1 }));
        return result;
      })
    );

    // 批量同步到服务器相册
    await fetch(`/api/albums/${albumId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ media: uploaded }),
    });

    setUploading(false);
    setUploadProgress({ done: 0, total: 0 });
    fetchAlbum();
  }

  async function handleDeleteMedia(mediaId: string) {
    if (!confirm("确定要删除这张照片吗？")) return;
    await fetch(`/api/albums/${albumId}/media/${mediaId}`, { method: "DELETE" });
    fetchAlbum();
  }

  if (!album) return <div className="text-center text-gray-400 py-10">加载中...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/albums" className="text-gray-400 hover:text-gray-600">←</Link>
        <div>
          <h2 className="text-lg font-semibold text-gray-700">{album.name}</h2>
          {album.description && <p className="text-sm text-gray-400">{album.description}</p>}
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="ml-auto bg-sky-400 hover:bg-sky-500 text-white px-3 py-1.5 rounded-full text-sm transition-colors"
        >
          {uploading
            ? uploadProgress.total > 0
              ? `上传中 ${uploadProgress.done}/${uploadProgress.total}...`
              : "上传中..."
            : "+ 添加照片"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>

      {album.media.length === 0 ? (
        <div className="text-center py-16 text-gray-300">
          <p className="text-4xl mb-2">📷</p>
          <p>还没有照片，快去添加吧</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {album.media.map((m) => (
            <div key={m.id} className="aspect-square overflow-hidden rounded-lg bg-sky-50 relative group">
              {m.type === "video" ? (
                <video src={m.url} className="w-full h-full object-cover" controls playsInline preload="metadata" />
              ) : (
                <img src={m.url} alt={m.caption ?? ""} className="w-full h-full object-cover" />
              )}
              <button
                onClick={() => handleDeleteMedia(m.id)}
                className="absolute top-1 right-1 bg-black/40 hover:bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="删除"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
