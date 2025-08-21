// components/roast-cards/MostUsedWords.tsx
import { ExaLogo } from './Logo';

interface MostUsedWordsProps {
  words: {
    word: string;
    emoji: string;
  }[];
}

export function MostUsedWords({ words }: MostUsedWordsProps) {
  return (
    <div className="rounded-none border bg-white p-6 shadow-sm animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">😭</span>
          <h3 className="text-xl font-semibold text-gray-900">
            Overused Words on Your Website
          </h3>
        </div>
        <ExaLogo />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {words.map((item) => (
          <div
            key={item.word}
            className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 transition-colors"
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="font-medium text-gray-700">{item.word}</span>
          </div>
        ))}
      </div>
      <div className="text-right pt-2">
        <span className="text-xs md:text-sm text-gray-400">
          <span className="">roastmywebsite.exa.ai</span>
        </span>
      </div>
    </div>
  );
}
