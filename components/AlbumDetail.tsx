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

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  async function handleUpload(files: FileList) {
    setUploading(true);
    setUploadProgress({ done: 0, total: files.length });

    const uploaded = await Promise.all(
      Array.from(files).map(async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        const result = (await uploadRes.json()) as { url: string; type: string };
        setUploadProgress((prev) => ({ ...prev, done: prev.done + 1 }));
        return result;
      })
    );

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

  if (!album) {
    return <div className="pixel-panel p-8 text-center farm-muted">加载中...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="pixel-panel flex flex-wrap items-center gap-3 p-4">
        <Link href="/albums" className="pixel-button pixel-button-secondary h-8 w-8 text-sm">
          ←
        </Link>
        <div className="min-w-0 flex-1">
          <h2 className="farm-title truncate text-lg">
            <span className="sdv-object-sprite sdv-object-chest" /> {album.name}
          </h2>
          {album.description && <p className="farm-muted truncate text-sm">{album.description}</p>}
        </div>
        <button onClick={() => fileRef.current?.click()} className="pixel-button px-3 py-1.5 text-sm">
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
        <div className="pixel-panel sdv-note p-6 text-center">
          <span className="sdv-object-sprite sdv-object-chest mx-auto mb-2 block" />
          <div className="mx-auto max-w-56">
            <p className="farm-title text-base">这个木箱还是空的</p>
            <p className="farm-muted mt-1 text-sm leading-6">添加照片或视频，把回忆收进来。</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {album.media.map((m) => (
            <div key={m.id} className="pixel-media-tile group relative aspect-square overflow-hidden">
              {m.type === "video" ? (
                <video src={m.url} className="h-full w-full object-cover" controls playsInline preload="metadata" />
              ) : (
                <img src={m.url} alt={m.caption ?? ""} className="h-full w-full object-cover" />
              )}
              <button
                onClick={() => handleDeleteMedia(m.id)}
                className="pixel-button pixel-button-danger absolute right-1 top-1 h-6 w-6 text-sm opacity-0 transition-opacity group-hover:opacity-100"
                title="删除"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
