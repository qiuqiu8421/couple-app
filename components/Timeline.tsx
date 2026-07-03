"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Media = { id: string; url: string; type: string };
type Author = { id: string; name: string; avatar?: string };
type Comment = { id: string; content: string; author: Author; createdAt: string };
type Post = {
  id: string;
  content: string;
  author: Author;
  media: Media[];
  comments: Comment[];
  likes: { userId: string }[];
  _count: { likes: number; comments: number };
  createdAt: string;
};

export default function Timeline({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPosts = useCallback(async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() && files.length === 0) return;
    setUploading(true);
    setUploadProgress({ done: 0, total: files.length });

    const uploadedMedia = await Promise.all(
      files.map(async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        setUploadProgress((prev) => ({ ...prev, done: prev.done + 1 }));
        return data as { url: string; type: string };
      })
    );

    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, media: uploadedMedia }),
    });

    setContent("");
    setFiles([]);
    setUploading(false);
    setUploadProgress({ done: 0, total: 0 });
    fetchPosts();
  }

  async function handleLike(postId: string) {
    await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    fetchPosts();
  }

  async function handleComment(postId: string) {
    const text = commentText[postId];
    if (!text?.trim()) return;
    await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    fetchPosts();
  }

  async function handleDelete(postId: string) {
    if (!confirm("确定要删除这条动态吗？")) return;
    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    fetchPosts();
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleString("zh-CN", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="pixel-panel space-y-3 p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <span className="pixel-avatar">
            <span className="sdv-object-sprite sdv-object-parsnip" />
          </span>
          <div>
            <h2 className="farm-title text-base">农场留言板</h2>
            <p className="farm-muted text-xs">你好呀</p>
          </div>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="说句话..."
          className="pixel-input min-h-24 resize-none px-3 py-2 text-sm"
          rows={3}
        />
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div key={i} className="relative">
                {f.type.startsWith("video") ? (
                  <video src={URL.createObjectURL(f)} className="h-16 w-16 rounded object-cover" playsInline preload="metadata" />
                ) : (
                  <img src={URL.createObjectURL(f)} className="h-16 w-16 rounded object-cover" alt="" />
                )}
                <button
                  type="button"
                  onClick={() => setFiles(files.filter((_, j) => j !== i))}
                  className="pixel-button pixel-button-danger absolute -right-1 -top-1 h-5 w-5 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 items-center gap-2 sm:flex sm:justify-between sm:gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="pixel-button pixel-button-secondary w-full whitespace-nowrap px-2 py-1.5 text-xs sm:w-auto sm:px-3 sm:text-sm"
          >
            <span className="sdv-object-sprite sdv-object-chest" /> 添加图片/视频
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
          <button
            type="submit"
            disabled={uploading || (!content.trim() && files.length === 0)}
            className="pixel-button w-full whitespace-nowrap px-3 py-1.5 text-xs sm:w-auto sm:px-4 sm:text-sm"
          >
            {uploading
              ? uploadProgress.total > 0
                ? `上传中 ${uploadProgress.done}/${uploadProgress.total}...`
                : "发布中..."
              : "发布"}
          </button>
        </div>
      </form>

      {posts.map((post) => {
        const liked = post.likes.some((l) => l.userId === userId);
        return (
          <div key={post.id} className="pixel-panel-soft space-y-3 p-4">
            <div className="flex items-center gap-2">
              <div className="pixel-avatar">{post.author.name[0]}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#5b2b16]">{post.author.name}</p>
                <p className="farm-muted text-xs">{formatDate(post.createdAt)}</p>
              </div>
              {post.author.id === userId && (
                <button
                  onClick={() => handleDelete(post.id)}
                  className="pixel-button pixel-button-danger h-7 w-7 text-sm"
                  title="删除"
                >
                  ×
                </button>
              )}
            </div>

            {post.content && <p className="text-sm leading-6 text-[#3b1f10]">{post.content}</p>}

            {post.media.length > 0 && (
              <div className={`grid gap-2 ${post.media.length === 1 ? "" : "grid-cols-2"}`}>
                {post.media.map((m) =>
                  m.type === "video" ? (
                    <video key={m.id} src={m.url} controls playsInline preload="metadata" className="pixel-media-tile max-h-64 w-full object-cover" />
                  ) : (
                    <img key={m.id} src={m.url} alt="" className="pixel-media-tile max-h-64 w-full object-cover" />
                  )
                )}
              </div>
            )}

            <div className="flex items-center gap-3 border-t-2 border-[#d8b56a] pt-2">
              <button
                onClick={() => handleLike(post.id)}
                className={`text-sm font-bold transition-colors ${liked ? "text-[#c65b4a]" : "text-[#7b5a3b] hover:text-[#c65b4a]"}`}
              >
                <span className="sdv-object-sprite sdv-object-heart" /> {post._count.likes}
              </button>
              <button
                onClick={() => setShowComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                className="text-sm font-bold text-[#7b5a3b] hover:text-[#4f8b3b]"
              >
                留言 {post._count.comments}
              </button>
            </div>

            {showComments[post.id] && (
              <div className="space-y-2">
                {post.comments.map((c) => (
                  <div key={c.id} className="rounded bg-[#fff2cc] px-3 py-2 text-sm">
                    <span className="font-bold text-[#5e3822]">{c.author.name}：</span>
                    <span className="text-[#3f2a18]">{c.content}</span>
                  </div>
                ))}
                <div className="mt-2 flex gap-2">
                  <input
                    value={commentText[post.id] ?? ""}
                    onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="说点什么..."
                    className="pixel-input flex-1 px-3 py-1.5 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleComment(post.id)}
                  />
                  <button onClick={() => handleComment(post.id)} className="pixel-button px-3 py-1.5 text-sm">
                    发送
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
