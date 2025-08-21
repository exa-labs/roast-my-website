// components/roast-cards/RecommendationsCard.tsx
import { ExaLogo } from './Logo';

interface RecommendationsCardProps {
  recommendations: Array<{
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    fix: string;
    why_it_matters: string;
  }>;
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-none border bg-white p-6 shadow-sm animate-fade-up">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 to-blue-500" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🛠️</span>
            <h3 className="text-xl font-semibold text-gray-900">How to Fix This Mess</h3>
          </div>
          <ExaLogo />
        </div>
        <div className="space-y-4">
          {recommendations.map((rec, index: number) => (
            <div key={index} className="border-l-4 border-brand-default pl-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  rec.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority}
                </span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{rec.fix}</h4>
              <p className="text-gray-600 text-sm">{rec.why_it_matters}</p>
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
