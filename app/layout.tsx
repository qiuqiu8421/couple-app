import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Couple Space",
  description: "A private shared space",
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
      <body className="min-h-screen bg-rose-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
