import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Couple Farm",
  description: "A private shared farm-style space",
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
