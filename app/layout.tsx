import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "秋秋喜欢周周",
  description: "秋秋和周周的小空间",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="farm-page">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
