// components/roast-cards/HighlightCard.tsx
import { ExaLogo } from './Logo';

interface HighlightCardProps {
  title: string;
  emoji: string;
  content: string | JSX.Element;
  gradient?: string;
}

export function HighlightCard({ title, emoji, content, gradient = "from-brand-default to-purple-600" }: HighlightCardProps) {
  return (
    <div className="relative overflow-hidden rounded-none border bg-white p-6 shadow-sm animate-fade-up">
      <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${gradient}`} />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{emoji}</span>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          </div>
          <ExaLogo />
        </div>
        {typeof content === 'string' ? (
          <p className="text-gray-700 leading-relaxed">{content}</p>
        ) : (
          content
        )}
        <div className="text-right pt-2">
          <span className="text-sm md:text-base text-gray-400">
            <span className="">roastmywebsite.exa.ai</span>
          </span>
        </div>
      </div>
    </div>
  );
}
