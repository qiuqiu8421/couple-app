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

    // 并行上传所有文件到服务器
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
      {/* Post composer */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="记录今天的小确幸..."
          className="w-full resize-none border-none outline-none text-gray-700 placeholder-gray-300 text-sm"
          rows={3}
        />
        {files.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {files.map((f, i) => (
              <div key={i} className="relative">
                {f.type.startsWith("video") ? (
                  <video src={URL.createObjectURL(f)} className="h-16 w-16 object-cover rounded-lg" playsInline preload="metadata" />
                ) : (
                  <img src={URL.createObjectURL(f)} className="h-16 w-16 object-cover rounded-lg" alt="" />
                )}
                <button
                  type="button"
                  onClick={() => setFiles(files.filter((_, j) => j !== i))}
                  className="absolute -top-1 -right-1 bg-gray-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                >×</button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-gray-400 hover:text-sky-400 text-sm"
          >
            📎 添加图片/视频
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
            className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-1.5 rounded-full text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {uploading
              ? uploadProgress.total > 0
                ? `上传中 ${uploadProgress.done}/${uploadProgress.total}...`
                : "发布中..."
              : "发布"}
          </button>
        </div>
      </form>

      {/* Posts */}
      {posts.map((post) => {
        const liked = post.likes.some((l) => l.userId === userId);
        return (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sky-200 flex items-center justify-center text-sky-500 font-bold text-sm">
                {post.author.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{post.author.name}</p>
                <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
              </div>
              {post.author.id === userId && (
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-gray-300 hover:text-red-400 text-xl leading-none transition-colors"
                  title="删除"
                >×</button>
              )}
            </div>

            {post.content && <p className="text-gray-700 text-sm">{post.content}</p>}

            {post.media.length > 0 && (
              <div className={`grid gap-1 ${post.media.length === 1 ? "" : "grid-cols-2"}`}>
                {post.media.map((m) =>
                  m.type === "video" ? (
                    <video key={m.id} src={m.url} controls playsInline preload="metadata" className="w-full rounded-lg max-h-64 object-cover" />
                  ) : (
                    <img key={m.id} src={m.url} alt="" className="w-full rounded-lg object-cover max-h-64" />
                  )
                )}
              </div>
            )}

            <div className="flex items-center gap-4 pt-1 border-t border-gray-50">
              <button
                onClick={() => handleLike(post.id)}
                className={`text-sm flex items-center gap-1 transition-colors ${liked ? "text-sky-500" : "text-gray-400 hover:text-sky-400"}`}
              >
                {liked ? "❤️" : "🤍"} {post._count.likes}
              </button>
              <button
                onClick={() => setShowComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                className="text-sm text-gray-400 hover:text-sky-400 flex items-center gap-1"
              >
                💬 {post._count.comments}
              </button>
            </div>

            {showComments[post.id] && (
              <div className="space-y-2">
                {post.comments.map((c) => (
                  <div key={c.id} className="flex gap-2 text-sm">
                    <span className="font-medium text-gray-600">{c.author.name}:</span>
                    <span className="text-gray-500">{c.content}</span>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    value={commentText[post.id] ?? ""}
                    onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    placeholder="说点什么..."
                    className="flex-1 border border-gray-100 rounded-full px-3 py-1 text-sm outline-none focus:border-sky-300"
                    onKeyDown={(e) => e.key === "Enter" && handleComment(post.id)}
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    className="text-sky-400 text-sm font-medium"
                  >
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
