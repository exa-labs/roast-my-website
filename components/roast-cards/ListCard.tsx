// components/roast-cards/ListCard.tsx
import { ExaLogo } from './Logo';

interface ListCardProps {
  title: string;
  emoji: string;
  items: string[];
  gradient?: string;
}

export function ListCard({ title, emoji, items, gradient = "from-red-500 to-orange-500" }: ListCardProps) {
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
        <div className="space-y-4 pl-1">
          {items.map((item: string, index: number) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2" />
              <p className="text-md text-gray-600 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
        <div className="text-right pt-2">
          <span className="text-xs md:text-sm text-gray-400">
            <span className="">roastmywebsite.exa.ai</span>
          </span>
        </div>
      </div>
    </div>
  );
}
