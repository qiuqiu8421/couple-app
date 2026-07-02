"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Navbar({ userName }: { userName: string }) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "小屋", icon: "🏡" },
    { href: "/albums", label: "相册", icon: "🖼️" },
    { href: "/anniversaries", label: "日历", icon: "🌻" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-10 border-b-4 border-[#5e3822] bg-[#c78642]/95 shadow-[0_4px_0_rgba(63,42,24,0.25)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <span className="farm-title text-lg text-[#fff2cc] [text-shadow:2px_2px_0_#5e3822]">
            🌾 Couple Farm
          </span>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-4 sm:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded px-2 py-1 text-sm font-bold transition-colors ${
                    pathname === link.href
                      ? "bg-[#fff2cc] text-[#5e3822]"
                      : "text-[#fff9dc] hover:bg-[#a96d36]"
                  }`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
            </div>
            <span className="hidden text-sm font-bold text-[#fff9dc] sm:inline">{userName}</span>
            <Link
              href="/settings"
              title="修改密码"
              className="hidden rounded border-2 border-[#5e3822] bg-[#fff2cc] px-2 py-1 text-xs font-bold text-[#5e3822] shadow-[0_2px_0_#5e3822] hover:bg-white sm:inline-block"
            >
              改密码
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="rounded border-2 border-[#5e3822] bg-[#fff2cc] px-2 py-1 text-xs font-bold text-[#5e3822] shadow-[0_2px_0_#5e3822] hover:bg-white"
            >
              退出
            </button>
          </div>
        </div>
      </nav>

      <div className="fixed bottom-0 left-0 right-0 z-10 border-t-4 border-[#5e3822] bg-[#fff2cc] shadow-[0_-4px_0_rgba(63,42,24,0.18)] sm:hidden">
        <div className="flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-1 flex-col items-center py-2 text-xs font-bold transition-colors ${
                pathname === link.href ? "bg-[#7ebc59] text-white" : "text-[#5e3822]"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
          <Link
            href="/settings"
            className={`flex flex-1 flex-col items-center py-2 text-xs font-bold transition-colors ${
              pathname === "/settings" ? "bg-[#7ebc59] text-white" : "text-[#5e3822]"
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
