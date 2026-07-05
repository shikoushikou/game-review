'use client';

import { useState } from 'react';

export default function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const fullUrl = `${window.location.origin}${url}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const input = document.createElement('input');
      input.value = fullUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = `🎮 ${title} - 我的游戏评测`;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border
                   text-sm text-text-muted hover:text-text hover:border-accent/50 transition-all"
      >
        {copied ? '✅ 已复制' : '🔗 复制链接'}
      </button>
      <button
        onClick={() => {
          const fullUrl = `${window.location.origin}${url}`;
          // try Web Share API first (mobile)
          if (navigator.share) {
            navigator.share({ title: shareText, url: fullUrl }).catch(() => {});
          } else {
            copyLink();
          }
        }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border
                   text-sm text-text-muted hover:text-text hover:border-accent/50 transition-all"
      >
        📤 分享
      </button>
    </div>
  );
}
