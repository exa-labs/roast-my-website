"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface WebsiteData {
  results?: any[];
}

interface LinkedInData {
  results?: any[];
}

interface LLMAnalysis {
  brutal_first_impression?: {
    headline: string;
    roast: string;
  };
  design_roast?: {
    score: number;
    brutal_feedback: string;
    specific_issues: string[];
  };
  content_destruction?: {
    score: number;
    harsh_reality: string;
    cringe_moments: string[];
  };
  user_experience_nightmare?: {
    score: number;
    pain_points: string;
    user_frustrations: string[];
  };
  business_reality_check?: {
    company_vibe: string;
    target_audience_confusion: string;
    competitive_disadvantage: string;
  };
  linkedin_intel?: {
    professional_image: string;
    website_vs_linkedin_gap: string;
  };
  savage_recommendations?: Array<{
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    fix: string;
    why_it_matters: string;
  }>;
  final_verdict?: {
    overall_score: number;
    one_liner_roast: string;
    biggest_problem: string;
    one_thing_done_right: string;
  };
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

            {/* Brutal Website Roast Display */}
            {llmAnalysis && (
              <div className="space-y-8 opacity-0 animate-fade-up [animation-delay:800ms]">
                
                {/* First Impression */}
                {llmAnalysis.brutal_first_impression && (
                  <div className="border border-red-200 bg-red-50 p-6 rounded-sm shadow-sm">
                    <h2 className="text-2xl font-bold mb-4 text-red-800">🔥 {llmAnalysis.brutal_first_impression.headline}</h2>
                    <p className="text-red-700 text-lg leading-relaxed">{llmAnalysis.brutal_first_impression.roast}</p>
                  </div>
                )}

                {/* Scores Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {llmAnalysis.design_roast && (
                    <div className="border border-gray-200 p-6 rounded-sm shadow-sm text-center">
                      <h3 className="text-lg font-semibold mb-2">🎨 Design Score</h3>
                      <div className="text-4xl font-bold mb-2 text-brand-default">{llmAnalysis.design_roast.score}/10</div>
                      <p className="text-gray-600 text-sm">{llmAnalysis.design_roast.brutal_feedback}</p>
                    </div>
                  )}
                  {llmAnalysis.content_destruction && (
                    <div className="border border-gray-200 p-6 rounded-sm shadow-sm text-center">
                      <h3 className="text-lg font-semibold mb-2">📝 Content Score</h3>
                      <div className="text-4xl font-bold mb-2 text-brand-default">{llmAnalysis.content_destruction.score}/10</div>
                      <p className="text-gray-600 text-sm">{llmAnalysis.content_destruction.harsh_reality}</p>
                    </div>
                  )}
                  {llmAnalysis.user_experience_nightmare && (
                    <div className="border border-gray-200 p-6 rounded-sm shadow-sm text-center">
                      <h3 className="text-lg font-semibold mb-2">😤 UX Score</h3>
                      <div className="text-4xl font-bold mb-2 text-brand-default">{llmAnalysis.user_experience_nightmare.score}/10</div>
                      <p className="text-gray-600 text-sm">{llmAnalysis.user_experience_nightmare.pain_points}</p>
                    </div>
                  )}
                </div>

                {/* Detailed Roasts */}
                <div className="space-y-6">
                  
                  {/* Design Issues */}
                  {llmAnalysis.design_roast?.specific_issues && (
                    <div className="border border-gray-200 p-6 rounded-sm shadow-sm">
                      <h3 className="text-xl font-semibold mb-4">🎨 Design Issues</h3>
                      <ul className="space-y-2">
                        {llmAnalysis.design_roast.specific_issues.map((issue: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span className="text-gray-700">{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Content Cringe */}
                  {llmAnalysis.content_destruction?.cringe_moments && (
                    <div className="border border-gray-200 p-6 rounded-sm shadow-sm">
                      <h3 className="text-xl font-semibold mb-4">📝 Content Cringe Moments</h3>
                      <ul className="space-y-2">
                        {llmAnalysis.content_destruction.cringe_moments.map((moment: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            <span className="text-gray-700">{moment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* UX Frustrations */}
                  {llmAnalysis.user_experience_nightmare?.user_frustrations && (
                    <div className="border border-gray-200 p-6 rounded-sm shadow-sm">
                      <h3 className="text-xl font-semibold mb-4">😤 User Frustrations</h3>
                      <ul className="space-y-2">
                        {llmAnalysis.user_experience_nightmare.user_frustrations.map((frustration: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span className="text-gray-700">{frustration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Business Reality Check */}
                  {llmAnalysis.business_reality_check && (
                    <div className="border border-gray-200 p-6 rounded-sm shadow-sm">
                      <h3 className="text-xl font-semibold mb-4">💼 Business Reality Check</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Company Vibe:</h4>
                          <p className="text-gray-700">{llmAnalysis.business_reality_check.company_vibe}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Target Audience Confusion:</h4>
                          <p className="text-gray-700">{llmAnalysis.business_reality_check.target_audience_confusion}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Competitive Disadvantage:</h4>
                          <p className="text-gray-700">{llmAnalysis.business_reality_check.competitive_disadvantage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LinkedIn Intel */}
                  {llmAnalysis.linkedin_intel && (
                    <div className="border border-blue-200 bg-blue-50 p-6 rounded-sm shadow-sm">
                      <h3 className="text-xl font-semibold mb-4 text-blue-800">🔍 LinkedIn Intel</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">Professional Image:</h4>
                          <p className="text-blue-700">{llmAnalysis.linkedin_intel.professional_image}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">Website vs LinkedIn Gap:</h4>
                          <p className="text-blue-700">{llmAnalysis.linkedin_intel.website_vs_linkedin_gap}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Savage Recommendations */}
                  {llmAnalysis.savage_recommendations && (
                    <div className="border border-gray-200 p-6 rounded-sm shadow-sm">
                      <h3 className="text-xl font-semibold mb-4">🛠️ Savage Recommendations</h3>
                      <div className="space-y-4">
                        {llmAnalysis.savage_recommendations.map((rec, index: number) => (
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
                    </div>
                  )}

                  {/* Final Verdict */}
                  {llmAnalysis.final_verdict && (
                    <div className="border border-gray-800 bg-gray-900 text-white p-6 rounded-sm shadow-sm">
                      <h3 className="text-xl font-semibold mb-4 text-white">⚖️ Final Verdict</h3>
                      <div className="text-center mb-6">
                        <div className="text-5xl font-bold mb-2 text-brand-default">{llmAnalysis.final_verdict.overall_score}/10</div>
                        <p className="text-xl italic mb-4">"{llmAnalysis.final_verdict.one_liner_roast}"</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2 text-red-300">Biggest Problem:</h4>
                          <p className="text-gray-300">{llmAnalysis.final_verdict.biggest_problem}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 text-green-300">One Thing Done Right:</h4>
                          <p className="text-gray-300">{llmAnalysis.final_verdict.one_thing_done_right}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
