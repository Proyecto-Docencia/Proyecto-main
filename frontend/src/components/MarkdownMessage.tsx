import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownMessageProps {
  content: string;
  isUser: boolean;
}

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content, isUser }) => {
  return (
    <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className={`text-xl font-bold mb-3 mt-4 ${isUser ? 'text-white' : 'text-slate-900'}`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`text-lg font-bold mb-2 mt-3 ${isUser ? 'text-white' : 'text-slate-900'}`}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={`text-base font-semibold mb-2 mt-3 ${isUser ? 'text-blue-100' : 'text-slate-800'}`}>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className={`text-sm font-semibold mb-1 mt-2 ${isUser ? 'text-blue-100' : 'text-slate-700'}`}>
              {children}
            </h4>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className={`mb-3 leading-relaxed ${isUser ? 'text-white' : 'text-slate-700'}`}>
              {children}
            </p>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className={`list-disc list-outside ml-5 mb-3 space-y-1 ${isUser ? 'text-white' : 'text-slate-700'}`}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={`list-decimal list-outside ml-5 mb-3 space-y-1 ${isUser ? 'text-white' : 'text-slate-700'}`}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className={`mb-1 ${isUser ? 'text-white' : 'text-slate-700'}`}>
              {children}
            </li>
          ),
          // Strong/Bold
          strong: ({ children }) => (
            <strong className={`font-bold ${isUser ? 'text-white' : 'text-slate-900'}`}>
              {children}
            </strong>
          ),
          // Emphasis/Italic
          em: ({ children }) => (
            <em className={`italic ${isUser ? 'text-blue-100' : 'text-slate-600'}`}>
              {children}
            </em>
          ),
          // Code blocks
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${
                  isUser 
                    ? 'bg-blue-700 text-blue-100' 
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}>
                  {children}
                </code>
              );
            }
            return (
              <code className={`block px-4 py-3 rounded-lg text-sm font-mono overflow-x-auto mb-3 ${
                isUser 
                  ? 'bg-blue-700 text-blue-100' 
                  : 'bg-slate-50 text-slate-800 border border-slate-200'
              }`}>
                {children}
              </code>
            );
          },
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className={`border-l-4 pl-4 py-2 mb-3 italic ${
              isUser 
                ? 'border-blue-300 text-blue-100' 
                : 'border-slate-300 text-slate-600 bg-slate-50'
            }`}>
              {children}
            </blockquote>
          ),
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className={`min-w-full border-collapse ${
                isUser ? 'border-blue-400' : 'border-slate-200'
              }`}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className={isUser ? 'bg-blue-700' : 'bg-slate-100'}>
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className={`border px-3 py-2 text-left font-semibold text-sm ${
              isUser 
                ? 'border-blue-400 text-white' 
                : 'border-slate-200 text-slate-900'
            }`}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className={`border px-3 py-2 text-sm ${
              isUser 
                ? 'border-blue-400 text-white' 
                : 'border-slate-200 text-slate-700'
            }`}>
              {children}
            </td>
          ),
          // Horizontal rule
          hr: () => (
            <hr className={`my-4 ${isUser ? 'border-blue-400' : 'border-slate-200'}`} />
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline hover:no-underline ${
                isUser ? 'text-blue-100' : 'text-blue-600'
              }`}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;
