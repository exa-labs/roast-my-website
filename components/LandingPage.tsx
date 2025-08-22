// components/LandingPage.tsx

"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import AnimatedGradientText from "./ui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function RoastMyWebsite() {
  const router = useRouter();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cleanUrl = (input: string): string => {
    // Remove http:// or https:// and www. if present
    let cleanedUrl = input.replace(/(https?:\/\/)?(www\.)?/, '');
    
    // Remove trailing slashes
    cleanedUrl = cleanedUrl.replace(/\/+$/, '');
    
    return cleanedUrl.toLowerCase();
  };

  const handleRoast = async (e: FormEvent) => {
    e.preventDefault(); // Prevent form submission refresh
    console.log("Website roast initiated.");

    if (!websiteUrl) {
      setError("Please enter your website URL to get roasted.");
      return;
    }

    setError(null);
    setIsLoading(true);

    // Clean the URL
    const cleanedUrl = cleanUrl(websiteUrl);

    // Route to the /[website] page
    router.push(`/${cleanedUrl}`);
  };

  return (
    <div className="flex flex-col min-h-screen w-full md:max-w-4xl z-0">
      {/* Badge positioned at the top */}
      <div className="w-full flex justify-center pt-6 opacity-0 animate-fade-up [animation-delay:200ms]">
        <Link href="https://x.com/ExaAILabs" target="_blank">
          <AnimatedGradientText>
            <span className="px-1 inline animate-gradient bg-gradient-to-r from-[#254bf1] via-purple-600 to-[#254bf1] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">
              Follow us on Twitter now!
            </span>
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 text-brand-default" />
          </AnimatedGradientText>
        </Link>
      </div>

      <main className="flex flex-col justify-center flex-grow w-full md:max-w-4xl p-2 md:p-6">
        <h1 className="md:text-6xl text-4xl pb-5 font-medium opacity-0 animate-fade-up [animation-delay:200ms]">
          Roast My
          <span className="text-brand-default"> Website </span>
        </h1>

        <p className="text-black mb-12 opacity-0 animate-fade-up [animation-delay:400ms]">
          AI analyzes your website and gives you brutally honest feedback
        </p>

        <form onSubmit={handleRoast} className="space-y-6">
          <input
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="Enter Your Website URL"
            autoFocus
            className="w-full bg-white p-3 border box-border outline-none rounded-none ring-2 ring-brand-default resize-none opacity-0 animate-fade-up [animation-delay:600ms]"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold px-2 py-2 rounded-none transition-all opacity-0 animate-fade-up [animation-delay:800ms] min-h-[50px] ring-2 ${
              isLoading 
                ? 'bg-gray-400 ring-gray-400 cursor-not-allowed text-white'
                : 'bg-brand-default ring-brand-default text-white active:bg-gray-400 active:ring-gray-400'
            }`}
          >
            {isLoading ? 'Generating...' : 'Roast My Website'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-none">
            {error}
          </div>
        )}
      </main>

      <footer className="w-full py-6 px-8 mb-6 mt-auto opacity-0 animate-fade-up [animation-delay:600ms]">
        <div className="max-w-md mx-auto flex flex-col items-center gap-6">
          <Link 
            href="https://dashboard.exa.ai/"
            target="_blank"
            className="w-full max-w-xl bg-black hover:bg-gray-900 text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-none transition-all flex items-center justify-center gap-2 group whitespace-normal text-sm md:text-base hover:scale-[1.02] hover:shadow-lg"
          >
            <span>Built with Exa API  -  Try here</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </Link>
  
          <p className="text-md text-center text-gray-600 pt-2">
            <Link 
              href="https://github.com/exa-labs/roast-my-website"
              target="_blank"
              className="hover:underline cursor-pointer inline-flex items-center gap-1 underline"
            >
              this project is opensource - go star it on github
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
