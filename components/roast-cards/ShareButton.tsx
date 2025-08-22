// components/roast-cards/ShareButton.tsx
import { ReactElement, useMemo } from 'react';
import { Share } from 'lucide-react';

interface ShareButtonProps {
  websiteUrl: string;
}

export const ShareButton = ({ websiteUrl }: ShareButtonProps): ReactElement => {
  // Array of human-like, direct CTAs
  const ctaOptions = [
    "Share Your Website Roast on Twitter",
    "Tweet Your Roast",
    "Send Your Roast to Friends",
    "Tweet This Roast",
    "Share Your Website Roast on Twitter",
    "Share Your Website Roast on Twitter",
  ];

  // Randomly select a CTA text that stays consistent during the component lifecycle
  const selectedCTA = useMemo(() => {
    return ctaOptions[Math.floor(Math.random() * ctaOptions.length)];
  }, []);
  const handleShare = () => {
    // Clean up the website URL to ensure it's properly formatted
    const cleanUrl = websiteUrl.replace(/^https?:\/\//, '');
    const tweetText = encodeURIComponent(
      `ai just roasted my website lol \n\nsee roast: https://roastmywebsite.exa.ai/${cleanUrl}\n\n`
    );
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetUrl, '_blank',);
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-6 py-3 text-base text-white bg-[var(--brand-default)] hover:bg-[var(--brand-dark)] rounded-md shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-default)] focus:ring-opacity-30"
      >
        <Share className="w-4 h-4" />
        {selectedCTA}
      </button>
    </div>
  );
};
