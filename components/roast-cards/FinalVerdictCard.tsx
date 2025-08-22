// components/roast-cards/FinalVerdictCard.tsx
import { ExaLogo } from './Logo';

interface FinalVerdictCardProps {
  verdict: {
    overall_score: number;
    one_liner_roast: string;
    biggest_problem: string;
    one_thing_done_right: string;
  };
}

export function FinalVerdictCard({ verdict }: FinalVerdictCardProps) {
  return (
    <div className="relative overflow-hidden rounded-none border bg-white p-6 shadow-sm animate-fade-up">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-red-500 to-purple-500" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚖️</span>
            <h3 className="text-xl font-semibold text-gray-900">The Final Verdict</h3>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 bg-brand-default rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">E</span>
            </div>
            <span className="text-xs text-gray-400">exa.ai</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-5xl font-bold mb-2 text-brand-default">{verdict.overall_score}/10</div>
          <p className="text-xl italic mb-4 text-gray-800">"{verdict.one_liner_roast}"</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 text-red-600">Biggest Problem:</h4>
            <p className="text-gray-700">{verdict.biggest_problem}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-green-600">One Thing Done Right:</h4>
            <p className="text-gray-700">{verdict.one_thing_done_right}</p>
          </div>
        </div>
        
        <div className="text-right pt-2">
          <span className="text-sm md:text-base text-gray-400">
            <span className="">roastmywebsite.exa.ai</span>
          </span>
        </div>
      </div>
    </div>
  );
}
