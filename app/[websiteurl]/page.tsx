"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface WebsiteData {
  title?: string;
  description?: string;
  url?: string;
  screenshotUrl?: string;
  mainPoints?: string[];
}

interface RoastData {
  overallScore?: number;
  designScore?: number;
  usabilityScore?: number;
  performanceScore?: number;
  contentScore?: number;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
  humorousComments?: string[];
}

export default function WebsiteRoastPage({ params }: { params: { websiteurl: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWebsiteData = async () => {
    try {
      const response = await fetch("/api/website-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: params.websiteurl }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch website data");
      }

      const data = await response.json();
      setWebsiteData(data);

      return data;
    } catch (err) {
      setError("Failed to load website data. Please check the URL and try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoastData = async (websiteData: WebsiteData) => {
    try {
      const response = await fetch("/api/website-roast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          websiteData,
          url: params.websiteurl
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze website");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let finalRoastData = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            finalRoastData = data.result;
            setRoastData(data.result);
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }
    } catch (err) {
      console.error("Failed to analyze website", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchWebsiteData();
      if (result) {
        fetchRoastData(result);
      }
    };

    loadData();
  }, [params.websiteurl]);

  return (
    <>
      <header className="sm:fixed relative top-0 left-0 w-full bg-secondary-default z-50 sm:shadow-sm">
        <div className="absolute top-5 left-5 opacity-0 animate-fade-up [animation-delay:200ms] hidden sm:block">
        </div>
        <div className="text-center sm:mb-2 sm:pb-2 space-y-2 opacity-0 animate-fade-up [animation-delay:400ms]">
          <p className="pt-5 text-xl sm:text-2xl font-bold text-gray-900">Roast My Website</p>
          <div className="text-gray-600 text-md sm:text-lg">
            Brutally honest feedback for your web presence
          </div>
        </div>
      </header>

      <div className="pt-8 min-h-screen w-full max-w-4xl mx-auto px-4 py-10 sm:pt-32">
        {isLoading && (
          <div className="flex items-center justify-center mt-10">
            <p className="text-gray-600 text-xl animate-pulse">Analyzing your website...</p>
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
            <div className="mb-10 opacity-0 animate-fade-up [animation-delay:600ms]">
              <div className="border border-gray-200 p-6 rounded-sm shadow-sm">
                <h2 className="text-2xl font-bold mb-4">{websiteData.title || params.websiteurl}</h2>
                <p className="text-gray-600 mb-4">{websiteData.description || "No description available"}</p>
                
                {websiteData.screenshotUrl && (
                  <div className="w-full mb-6">
                    <Image 
                      src={websiteData.screenshotUrl}
                      alt={`Screenshot of ${params.websiteurl}`}
                      width={800}
                      height={450}
                      className="w-full h-auto shadow-md"
                    />
                  </div>
                )}
                
                {websiteData.mainPoints && websiteData.mainPoints.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Key Observations:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {websiteData.mainPoints.map((point, index) => (
                        <li key={index} className="text-gray-700">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {roastData ? (
              <div className="space-y-8 opacity-0 animate-fade-up [animation-delay:800ms]">
                <div className="border border-gray-200 p-6 rounded-sm shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">The Brutal Roast</h2>
                  
                  {roastData.overallScore !== undefined && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Overall Score:</h3>
                      <div className="flex items-center">
                        <div className="text-3xl font-bold mr-2">{roastData.overallScore}/10</div>
                        <div className="text-gray-600">
                          {roastData.overallScore < 4 ? "Yikes..." : 
                           roastData.overallScore < 7 ? "Not bad, but..." : 
                           "Pretty solid!"}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {roastData.designScore !== undefined && (
                      <div className="p-4 bg-gray-50 rounded-sm">
                        <h4 className="font-semibold">Design</h4>
                        <div className="text-2xl font-bold">{roastData.designScore}/10</div>
                      </div>
                    )}
                    {roastData.usabilityScore !== undefined && (
                      <div className="p-4 bg-gray-50 rounded-sm">
                        <h4 className="font-semibold">Usability</h4>
                        <div className="text-2xl font-bold">{roastData.usabilityScore}/10</div>
                      </div>
                    )}
                    {roastData.performanceScore !== undefined && (
                      <div className="p-4 bg-gray-50 rounded-sm">
                        <h4 className="font-semibold">Performance</h4>
                        <div className="text-2xl font-bold">{roastData.performanceScore}/10</div>
                      </div>
                    )}
                    {roastData.contentScore !== undefined && (
                      <div className="p-4 bg-gray-50 rounded-sm">
                        <h4 className="font-semibold">Content</h4>
                        <div className="text-2xl font-bold">{roastData.contentScore}/10</div>
                      </div>
                    )}
                  </div>
                  
                  {roastData.strengths && roastData.strengths.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">What's Working:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {roastData.strengths.map((strength, index) => (
                          <li key={index} className="text-green-700">{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {roastData.weaknesses && roastData.weaknesses.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">What's Not Working:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {roastData.weaknesses.map((weakness, index) => (
                          <li key={index} className="text-red-700">{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {roastData.humorousComments && roastData.humorousComments.length > 0 && (
                    <div className="mb-6 p-4 bg-yellow-50 rounded-sm">
                      <h3 className="text-lg font-semibold mb-2">Brutal Honesty:</h3>
                      <ul className="list-none space-y-2">
                        {roastData.humorousComments.map((comment, index) => (
                          <li key={index} className="italic text-gray-800">"{comment}"</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {roastData.recommendations && roastData.recommendations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">How To Fix It:</h3>
                      <ul className="list-decimal pl-5 space-y-2">
                        {roastData.recommendations.map((rec, index) => (
                          <li key={index} className="text-gray-800">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-24 animate-pulse">
                <p className="text-gray-600 text-2xl">Generating your brutal website roast...</p>
              </div>
            )}

            <footer className="w-full py-6 px-8 mb-6 mt-16 opacity-0 animate-fade-up [animation-delay:1000ms]">
              <div className="max-w-md mx-auto flex flex-col items-center gap-6">
                <Link 
                  href="/"
                  className="w-full max-w-xl bg-black hover:bg-gray-900 text-white font-medium py-2 md:py-3 px-4 md:px-6 rounded-none transition-all flex items-center justify-center gap-2 group whitespace-normal text-sm md:text-base hover:scale-[1.02] hover:shadow-lg"
                >
                  <span>Roast another website</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </Link>
                
                <p className="text-md text-center text-gray-600 pt-2">
                  Powered by AI - Brutally honest feedback for your web presence
                </p>
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
}
