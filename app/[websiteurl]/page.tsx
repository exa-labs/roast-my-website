"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { HighlightCard } from '@/components/roast-cards/HighlightCard';
import { ListCard } from '@/components/roast-cards/ListCard';
import { MostUsedWords } from '@/components/roast-cards/MostUsedWords';
import { RecommendationsCard } from '@/components/roast-cards/RecommendationsCard';
import { FinalVerdictCard } from '@/components/roast-cards/FinalVerdictCard';
import { ShareButton } from '@/components/roast-cards/ShareButton';

interface WebsiteData {
  results?: any[];
}

interface LinkedInData {
  results?: any[];
}

interface LLMAnalysis {
  roast?: string[];
  strengths?: string[];
  cringy_content?: string[];
  improvements?: string[];
  overused_words?: Array<{
    word: string;
    emoji: string;
  }>;
  joke?: string;
  competitor?: {
    name: string;
    comparison: string;
  };
  money?: string;
  human_form?: string;
}

export default function WebsiteRoastPage({ params }: { params: { websiteurl: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [linkedinData, setLinkedinData] = useState<LinkedInData | null>(null);
  const [llmAnalysis, setLlmAnalysis] = useState<LLMAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Loading states for each API call
  const [websiteLoading, setWebsiteLoading] = useState(true);
  const [linkedinLoading, setLinkedinLoading] = useState(true);
  const [llmLoading, setLlmLoading] = useState(false);

  // Fetch website data using Exa API
  const fetchWebsiteData = async () => {
    try {
      setWebsiteLoading(true);
      const response = await fetch("/api/exa_website_scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteurl: params.websiteurl }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch website data");
      }

      const data = await response.json();
      setWebsiteData(data);
      return data;
    } catch (err) {
      console.error("Failed to load website data:", err);
      setError("Failed to load website data. Please check the URL and try again.");
      return null;
    } finally {
      setWebsiteLoading(false);
    }
  };

  // Fetch LinkedIn data using Exa API
  const fetchLinkedInData = async () => {
    try {
      setLinkedinLoading(true);
      const response = await fetch("/api/linkedin_content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ websiteurl: params.websiteurl }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch LinkedIn data");
      }

      const data = await response.json();
      setLinkedinData(data);
      return data;
    } catch (err) {
      console.error("Failed to load LinkedIn data:", err);
      // Don't set error for LinkedIn failure, it's optional
      return null;
    } finally {
      setLinkedinLoading(false);
    }
  };

  // Fetch LLM analysis using both website and LinkedIn data with streaming
  const fetchLLMAnalysis = async (websiteData: WebsiteData, linkedinData: LinkedInData | null) => {
    try {
      setLlmLoading(true);
      const response = await fetch("/api/llm_content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          subpages: websiteData.results || [],
          mainpage: websiteData.results?.[0] || {},
          linkedinData: linkedinData?.results || [],
          websiteurl: params.websiteurl
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze content");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let finalAnalysis = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            finalAnalysis = data.result;
            setLlmAnalysis(data.result);
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }

      return finalAnalysis;
    } catch (err) {
      console.error("Failed to analyze content:", err);
      setError("Failed to analyze content. Please try again.");
      return null;
    } finally {
      setLlmLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // Start both API calls in parallel
      const [websiteResult, linkedinResult] = await Promise.allSettled([
        fetchWebsiteData(),
        fetchLinkedInData()
      ]);

      // Extract successful results
      const websiteData = websiteResult.status === 'fulfilled' ? websiteResult.value : null;
      const linkedinData = linkedinResult.status === 'fulfilled' ? linkedinResult.value : null;

      // Update overall loading state
      setIsLoading(false);

      // If we have website data (minimum required), proceed with LLM analysis
      if (websiteData) {
        await fetchLLMAnalysis(websiteData, linkedinData);
      }
    };

    loadData();
  }, [params.websiteurl]);

  return (
    <>
      <header className="relative top-0 left-0 w-full z-50 sm:shadow-sm">
        <div className="absolute top-5 left-5 opacity-0 animate-fade-up [animation-delay:200ms] hidden sm:block">
        </div>
        <div className="text-center sm:mb-2 sm:pb-2 space-y-2 opacity-0 animate-fade-up [animation-delay:400ms]">
          <p className="pt-5 text-xl sm:text-2xl font-bold text-gray-900">Roast My Website</p>
          <div className="text-gray-600 text-md sm:text-lg">
            Brutally honest feedback for your web presence
          </div>
        </div>
      </header>

      <div className="min-h-screen w-full max-w-4xl mx-auto px-4 py-10">
        {/* Loading States */}
        {(websiteLoading || linkedinLoading) && (
          <div className="flex items-center justify-center mt-10">
            <div className="text-center space-y-4">
              <p className="text-gray-600 text-xl animate-pulse">Scraping website content...</p>
              <div className="flex gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${websiteLoading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                  <span className="text-sm text-gray-600">Website Data</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${linkedinLoading ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                  <span className="text-sm text-gray-600">LinkedIn Data</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {llmLoading && (
          <div className="flex items-center justify-center mt-10">
            <p className="text-gray-600 text-xl animate-pulse">Analyzing content with AI...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center mt-10 mb-10">
            <div className="text-center p-8 bg-red-50 rounded-none shadow-md">
              <h1 className="text-2xl font-bold text-red-600">Oops! Please Try Again</h1>
              <p className="text-gray-600 mt-2">{error}</p>
              <button
                onClick={() => window.location.href = '/'}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors"
              >
                Go back and try again
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && !websiteData && (
          <div className="flex items-center justify-center">
            <p className="text-gray-600">No website data found.</p>
          </div>
        )}

        {!isLoading && !error && websiteData && (
          <>
            {/* Website Data Display */}
            <div className="mb-10 opacity-0 animate-fade-up [animation-delay:600ms]">
              <div className="border border-gray-200 p-6 rounded-sm shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Website: {params.websiteurl}</h2>
                
                {websiteData.results && websiteData.results.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Scraped Website Content:</h3>
                    <div className="space-y-3">
                      {websiteData.results.map((result: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-sm">
                          <h4 className="font-medium text-sm text-gray-900">{result.title || `Page ${index + 1}`}</h4>
                          <p className="text-xs text-gray-600 mt-1">{result.url}</p>
                          {result.text && (
                            <p className="text-sm text-gray-700 mt-2 line-clamp-3">{result.text.substring(0, 200)}...</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {linkedinData && linkedinData.results && linkedinData.results.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">LinkedIn Profile Data:</h3>
                    <div className="space-y-3">
                      {linkedinData.results.map((result: any, index: number) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-sm">
                          <h4 className="font-medium text-sm text-gray-900">{result.title || `LinkedIn Profile ${index + 1}`}</h4>
                          <p className="text-xs text-gray-600 mt-1">{result.url}</p>
                          {result.text && (
                            <p className="text-sm text-gray-700 mt-2 line-clamp-3">{result.text.substring(0, 200)}...</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Website Roast Display with Cards */}
            {llmAnalysis && (
              <div className="mt-16 mb-10 space-y-16">
                
                {/* Roast Points */}
                {Array.isArray(llmAnalysis.roast) && llmAnalysis.roast.length > 0 && (
                  <>
                    <div className="opacity-0 animate-fade-up">
                      <ListCard
                        title="Roast"
                        emoji="🔥"
                        items={llmAnalysis.roast}
                        gradient="from-red-500 to-orange-500"
                      />
                    </div>
                    <ShareButton websiteUrl={params.websiteurl} />
                  </>
                )}

                {/* Strengths */}
                {Array.isArray(llmAnalysis.strengths) && llmAnalysis.strengths.length > 0 && (
                  <>
                    <div className="opacity-0 animate-fade-up [animation-delay:200ms]">
                      <HighlightCard
                        title="Strengths"
                        emoji="💪"
                        content={
                          <div className="space-y-3">
                            {llmAnalysis.strengths.map((strength, index) => {
                              const [title, ...descriptionParts] = strength.split(':');
                              const description = descriptionParts.join(':').trim();
                              return (
                                <p key={index} className="text-gray-700 leading-relaxed">
                                  <span className="font-bold">{title}:</span> {description}
                                </p>
                              );
                            })}
                          </div>
                        }
                        gradient="from-green-500 to-blue-500"
                      />
                    </div>
                    <ShareButton websiteUrl={params.websiteurl} />
                  </>
                )}

                {/* Joke */}
                {llmAnalysis.joke && (
                  <>
                    <div className="opacity-0 animate-fade-up [animation-delay:400ms]">
                      <HighlightCard
                        title="Joke"
                        emoji="😂"
                        content={llmAnalysis.joke}
                        gradient="from-yellow-400 to-orange-400"
                      />
                    </div>
                    <ShareButton websiteUrl={params.websiteurl} />
                  </>
                )}

                {/* Competitor */}
                {llmAnalysis.competitor && (
                  <>
                    <div className="opacity-0 animate-fade-up [animation-delay:600ms]">
                      <HighlightCard
                        title="Competitor Comparison"
                        emoji="🏆"
                        content={llmAnalysis.competitor.comparison}
                        gradient="from-blue-500 to-green-500"
                      />
                    </div>
                    <ShareButton websiteUrl={params.websiteurl} />
                  </>
                )}

                {/* Human Form */}
                {llmAnalysis.human_form && (
                  <>
                    <div className="opacity-0 animate-fade-up [animation-delay:800ms]">
                      <HighlightCard
                        title="Human Form"
                        emoji="👤"
                        content={llmAnalysis.human_form}
                        gradient="from-indigo-500 to-purple-500"
                      />
                    </div>
                    <ShareButton websiteUrl={params.websiteurl} />
                  </>
                )}

                {/* Money */}
                {llmAnalysis.money && (
                  <>
                    <div className="opacity-0 animate-fade-up [animation-delay:1000ms]">
                      <HighlightCard
                        title="Money Talk"
                        emoji="💰"
                        content={llmAnalysis.money}
                        gradient="from-green-500 to-emerald-500"
                      />
                    </div>
                    <ShareButton websiteUrl={params.websiteurl} />
                  </>
                )}

                {/* Cringy Content */}
                {Array.isArray(llmAnalysis.cringy_content) && llmAnalysis.cringy_content.length > 0 && (
                  <>
                    <div className="opacity-0 animate-fade-up [animation-delay:1200ms]">
                      <ListCard
                        title="Cringy Content"
                        emoji="🤡"
                        items={llmAnalysis.cringy_content}
                        gradient="from-yellow-500 to-red-500"
                      />
                    </div>
                    <ShareButton websiteUrl={params.websiteurl} />
                  </>
                )}

                {/* Improvements */}
                {Array.isArray(llmAnalysis.improvements) && llmAnalysis.improvements.length > 0 && (
                  <>
                    <div className="opacity-0 animate-fade-up [animation-delay:1400ms]">
                      <HighlightCard
                        title="Improvements"
                        emoji="🛠️"
                        content={
                          <div className="space-y-3">
                            {llmAnalysis.improvements.map((improvement, index) => (
                              <p key={index} className="text-gray-700 leading-relaxed">{improvement}</p>
                            ))}
                          </div>
                        }
                        gradient="from-blue-500 to-purple-500"
                      />
                    </div>
                    <ShareButton websiteUrl={params.websiteurl} />
                  </>
                )}

                {/* Overused Words */}
                {Array.isArray(llmAnalysis.overused_words) && llmAnalysis.overused_words.length > 0 && (
                  <>
                    <div className="opacity-0 animate-fade-up [animation-delay:1600ms]">
                      <MostUsedWords words={llmAnalysis.overused_words} />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4 pt-8">
                      <p className="text-gray-500 text-center">Share your website roast with the world!</p>
                      <ShareButton websiteUrl={params.websiteurl} />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Show loading state for LLM analysis */}
            {!llmAnalysis && !llmLoading && websiteData && (
              <div className="flex items-center justify-center py-24">
                <p className="text-gray-600 text-xl">Waiting for AI analysis...</p>
              </div>
            )}

            <footer className="w-full py-6 px-8 mb-6 mt-16 opacity-0 animate-fade-up [animation-delay:1000ms]">
              <div className="max-w-md mx-auto flex flex-col items-center gap-6">
                <Link 
                  href="https://dashboard.exa.ai/"
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
          </>
        )}
      </div>
    </>
  );
}
