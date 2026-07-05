import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "My Game Reviews", template: "%s | Game Reviews" },
  description: "个人游戏评测记录",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-bold text-lg tracking-tight">
                🎮 <span className="text-accent">Game</span>Review
              </Link>
              <Link href="/" className="text-sm text-text-muted hover:text-text transition-colors">首页</Link>
              <Link href="/stats" className="text-sm text-text-muted hover:text-text transition-colors">统计</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-sm text-text-muted hover:text-text transition-colors">管理</Link>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-6 text-center text-sm text-text-muted">
          个人游戏评测 · 记录每一次游玩体验
        </footer>
      </body>
    </html>
  );
}
