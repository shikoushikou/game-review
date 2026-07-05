'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content }: { content: string | null }) {
  if (!content) {
    return <div className="text-text-muted text-sm text-center py-8">暂无评测内容</div>;
  }

  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
