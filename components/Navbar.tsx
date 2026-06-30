"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Navbar({ userName }: { userName: string }) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "动态", icon: "🏠" },
    { href: "/albums", label: "相册", icon: "📷" },
    { href: "/anniversaries", label: "纪念日", icon: "💝" },
  ];

  return (
    <>
      {/* 顶部栏 */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-rose-500 font-bold text-lg">💕 Couple Space</span>
          <div className="flex items-center gap-3">
            {/* 桌面端导航 */}
            <div className="hidden sm:flex items-center gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-rose-500"
                      : "text-gray-500 hover:text-rose-400"
                  }`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
            <span className="text-gray-400 text-sm hidden sm:inline">{userName}</span>
            <Link
              href="/settings"
              title="修改密码"
              className="text-gray-400 hover:text-gray-600 text-xs border border-gray-200 rounded-full px-2 py-1 hidden sm:inline-block"
            >
              改密码
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-gray-400 hover:text-gray-600 text-xs border border-gray-200 rounded-full px-2 py-1"
            >
              退出
            </button>
          </div>
        </div>
      </nav>

      {/* 手机底部导航栏 */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-10 safe-area-inset-bottom">
        <div className="flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                pathname === link.href
                  ? "text-rose-500"
                  : "text-gray-400"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
          <Link
            href="/settings"
            className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
              pathname === "/settings" ? "text-rose-500" : "text-gray-400"
            }`}
          >
            <span className="text-xl">⚙️</span>
            <span>设置</span>
          </Link>
        </div>
      </div>
    </>
  );
}
