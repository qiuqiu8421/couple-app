"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Navbar({ userName }: { userName: string }) {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "小屋", iconClass: "sdv-object-home" },
    { href: "/albums", label: "相册", iconClass: "sdv-object-chest" },
    { href: "/anniversaries", label: "日历", iconClass: "sdv-object-calendar" },
  ];

  return (
    <>
      <nav className="sdv-nav sticky top-0 z-10 shadow-[0_4px_0_rgba(42,18,9,0.28)]">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <span className="farm-title text-lg text-[#fff2cc] [text-shadow:2px_2px_0_#2a1209]">
            <span className="sdv-object-sprite sdv-object-parsnip" /> 秋秋喜欢周周
          </span>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-4 sm:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded px-2 py-1 text-sm font-bold transition-colors ${
                    pathname === link.href
                      ? "bg-[#fff2cc] text-[#5b2b16] shadow-[inset_0_-2px_0_rgba(42,18,9,0.22)]"
                      : "text-[#fff9dc] hover:bg-[#8f4a22]"
                  }`}
                >
                  <span className={`sdv-object-sprite ${link.iconClass}`} /> {link.label}
                </Link>
              ))}
            </div>
            <span className="hidden text-sm font-bold text-[#fff9dc] [text-shadow:1px_1px_0_#2a1209] sm:inline">{userName}</span>
            <Link
              href="/settings"
              title="修改密码"
              className="hidden border-2 border-[#2a1209] bg-[#fff2cc] px-2 py-1 text-xs font-bold text-[#5b2b16] shadow-[0_2px_0_#2a1209] hover:bg-white sm:inline-block"
            >
              改密码
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="border-2 border-[#2a1209] bg-[#fff2cc] px-2 py-1 text-xs font-bold text-[#5b2b16] shadow-[0_2px_0_#2a1209] hover:bg-white"
            >
              退出
            </button>
          </div>
        </div>
      </nav>

      <div className="sdv-bottom-nav fixed bottom-0 left-0 right-0 z-10 shadow-[0_-4px_0_rgba(42,18,9,0.22)] sm:hidden">
        <div className="flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-1 flex-col items-center py-2 text-xs font-bold transition-colors ${
                pathname === link.href ? "bg-[#7ebc59] text-white" : "text-[#5e3822]"
              }`}
            >
              <span className={`sdv-object-sprite ${link.iconClass}`} />
              <span>{link.label}</span>
            </Link>
          ))}
          <Link
            href="/settings"
            className={`flex flex-1 flex-col items-center py-2 text-xs font-bold transition-colors ${
              pathname === "/settings" ? "bg-[#7ebc59] text-white" : "text-[#5e3822]"
            }`}
          >
            <span className="sdv-object-sprite sdv-object-home" />
            <span>设置</span>
          </Link>
        </div>
      </div>
    </>
  );
}
