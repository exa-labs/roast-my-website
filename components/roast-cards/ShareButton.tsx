// components/roast-cards/ShareButton.tsx
import { ReactElement } from 'react';

interface ShareButtonProps {
  websiteUrl: string;
}

export const ShareButton = ({ websiteUrl }: ShareButtonProps): ReactElement => {
  const handleShare = () => {
    const tweetText = encodeURIComponent(
      `Just got my website brutally roasted! 😅\n\nCheck out the savage feedback: https://roastmywebsite.exa.ai/${websiteUrl}\n\nBuilt with @ExaAILabs`
    );
    const tweetUrl = `https://x.com/intent/tweet?text=${tweetText}`;
    window.open(tweetUrl, '_blank');
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleShare}
        className="inline-flex items-center px-6 py-2 text-md font-medium text-gray-500 bg-transparent border border-gray-300 rounded-sm hover:bg-white hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
      >
        Share This Roast on Twitter
      </button>
    </div>
  );
};
