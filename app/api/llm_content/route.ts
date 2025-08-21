// /app/api/llm_content/route.ts 
import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from "@ai-sdk/anthropic";
import { streamObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 100;

export async function POST(req: NextRequest) {
  try {
    const { subpages, mainpage, linkedinData, websiteurl } = await req.json();
    
    if (!subpages || !mainpage) {
      return NextResponse.json({ error: 'Mainpage or subpage content is required' }, { status: 400 });
    }

    const subpagesText = JSON.stringify(subpages, null, 2);
    const mainpageText = JSON.stringify(mainpage, null, 2);
    const linkedinText = linkedinData ? JSON.stringify(linkedinData, null, 2) : null;

    // Define the comprehensive website roasting schema
    const websiteRoastSchema = z.object({
      brutal_first_impression: z.object({
        headline: z.string(),
        roast: z.string()
      }),
      design_roast: z.object({
        brutal_feedback: z.string(),
        specific_issues: z.array(z.string()).length(3)
      }),
      content_destruction: z.object({
        harsh_reality: z.string(),
        cringe_moments: z.array(z.string()).length(3)
      }),
      user_experience_nightmare: z.object({
        pain_points: z.string(),
        user_frustrations: z.array(z.string()).length(3)
      }),
      most_used_words: z.object({
        overused_terms: z.array(z.object({
          word: z.string(),
          emoji: z.string()
        })).length(6)
      }),
      business_reality_check: z.object({
        company_vibe: z.string(),
        target_audience_confusion: z.string(),
        competitive_disadvantage: z.string()
      }),
      linkedin_intel: z.object({
        professional_image: z.string(),
        website_vs_linkedin_gap: z.string()
      }).optional(),
      savage_recommendations: z.array(z.object({
        priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
        fix: z.string(),
        why_it_matters: z.string()
      })).length(5),
      final_verdict: z.object({
        overall_score: z.number().min(1).max(10),
        one_liner_roast: z.string(),
        biggest_problem: z.string(),
        one_thing_done_right: z.string()
      })
    });

    const prompt = `You are a brutally honest website critic who doesn't hold back. You're like that friend who tells you the truth even when it hurts. Write like you're roasting a friend's website - be savage but specific.

Analyze this website and give it the roasting it deserves:

WEBSITE URL: ${websiteurl}

WEBSITE CONTENT:
${mainpageText}

SUBPAGES CONTENT:
${subpagesText}

${linkedinText ? `LINKEDIN PROFILE:
${linkedinText}
` : ''}

ROAST THIS WEBSITE BRUTALLY:

🔥 BRUTAL FIRST IMPRESSION
What's your immediate reaction when you land on this site? Be savage but specific.

🎨 DESIGN ROAST
Tear apart their design choices. What looks amateur? What screams "I made this in 2005"? Be specific about colors, layout, typography, images.

📝 CONTENT DESTRUCTION
Roast their copy, messaging, and content. What's confusing? What's boring? What makes you cringe? Quote specific examples.

😤 USER EXPERIENCE NIGHTMARE
What will frustrate users? What's hard to find? What's broken or annoying? Be specific about navigation, loading, mobile experience.

📝 MOST OVERUSED WORDS
What words do they use way too much on their website? Find the 6 most overused/cringy terms and give each an appropriate emoji.

💼 BUSINESS REALITY CHECK
Based on their website, what vibe do they give off? Who do they think they're targeting vs who they're actually reaching? How do they stack up against competitors?

${linkedinText ? `🔍 LINKEDIN INTEL
How does their LinkedIn presence compare to their website? Any gaps or inconsistencies?` : ''}

🛠️ SAVAGE RECOMMENDATIONS (5 fixes)
What needs to be fixed ASAP? Prioritize by HIGH/MEDIUM/LOW and explain why each matters.

⚖️ FINAL VERDICT
Overall score (1-10), one brutal one-liner, biggest problem, and one thing they actually did right (if anything).

RULES:
- Be brutally honest but constructive
- Use specific examples from their actual content
- Write like a human, not a generic AI
- Keep it simple and direct
- No corporate speak or fluff
- Be savage but not mean-spirited
- Reference actual elements from their site

Make this roast so specific they'll know you actually looked at their site!`;

    try {
      const { partialObjectStream } = streamObject({
        model: anthropic('claude-sonnet-4-20250514'),
        schema: websiteRoastSchema,
        system: "You are a brutally honest website critic. Write like a human who doesn't hold back but gives constructive feedback. Be specific, direct, and reference actual content from the website.",
        prompt: prompt,
        providerOptions: {
          anthropic: {
            sendReasoning: false
          }
        }
      });

      // Create a TransformStream to convert the stream to a ReadableStream
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const partialObject of partialObjectStream) {
              controller.enqueue(new TextEncoder().encode(JSON.stringify({ result: partialObject }) + '\n'));
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } catch (error) {
      // If rate limited, retry with fallback model
      if (error instanceof Error && 'status' in error && error.status === 429) {
        const { partialObjectStream } = streamObject({
          model: anthropic('claude-3-7-sonnet-20250219'),
          schema: websiteRoastSchema,
          system: "You are a brutally honest website critic. Write like a human who doesn't hold back but gives constructive feedback. Be specific, direct, and reference actual content from the website.",
          prompt: prompt,
          providerOptions: {
            anthropic: {
              sendReasoning: false
            }
          }
        });

        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const partialObject of partialObjectStream) {
                controller.enqueue(new TextEncoder().encode(JSON.stringify({ result: partialObject }) + '\n'));
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          },
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }

      console.error('Website Roast API error:', error);
      return NextResponse.json({ error: `Website Roast API Failed | ${error}` }, { status: 500 });
    }

  } catch (error) {
    console.error('Company summary API error:', error);
    return NextResponse.json({ error: `Company summary API Failed | ${error}` }, { status: 500 });
  }
}