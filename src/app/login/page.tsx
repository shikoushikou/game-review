'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || '密码错误');
        setLoading(false);
      }
    } catch (err) {
      setError('网络错误，请检查连接');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <div className="card p-8">
        <h1 className="text-xl font-bold text-center mb-6">管理后台登录</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="请输入管理密码"
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text
                       placeholder:text-text-muted focus:outline-none focus:border-accent/50"
            autoFocus
            autoComplete="off"
          />
          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white rounded-lg py-3 font-medium
                       hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? '验证中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}
