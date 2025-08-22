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
      roast: z.array(z.string()).length(5),
      strengths: z.array(z.string()).length(5),
      joke: z.string(),
      competitor: z.object({
        name: z.string(),
        comparison: z.string()
      }),
      human_form: z.string(),
      money: z.string(),
      cringy_content: z.array(z.string()).length(3),
      improvements: z.array(z.string()).length(5),
      overused_words: z.array(z.object({
        word: z.string(),
        emoji: z.string()
      })).length(3)
    });

    const prompt = `You are a website critic who gives honest feedback. Analyze this website and provide feedback in these exact sections:

WEBSITE URL: ${websiteurl}

${linkedinText ? `LINKEDIN PROFILE:
  ${linkedinText}
  ` : ''}

SUBPAGES CONTENT:
${subpagesText}

WEBSITE CONTENT:
${mainpageText}


Provide feedback in these sections only:

🔥 ROAST (5 points)
Give 5 brutal but specific roast points about this website. Make 5 friendly jokes on them. Keep it fun and unique. Talk like a brutal friend.

💪 STRENGTHS (5 points) 
Give 5 strengths in "heading: subheading" format. Give 5 things they're great at. Hype them up.

😂 JOKE
Write a very witty joke and you can also include a pun in it (with the company name).

🏆 COMPETITOR
Pick some competitors/alternatives and praise the current website more than the competitor(s). Keep this very positive.

👤 HUMAN FORM
If this company was a human, who would it be? Format: "If this company was a human, it would be <famous person> because <reason>" (keep positive). This should be very unique.

💰 MONEY (1-2 lines)
Something like: "Very high chance this becomes a billion dollar company because <add praise>"

🤡 CRINGY CONTENT (3 moments)
Find exactly 3 cringy moments from their content. Format each as: "Cringy content..." followed by why it's cringy in a few words.

🛠️ IMPROVEMENTS (5 simple recommendations)
Give 5 simple, positive, actually useful improvements.

📝 OVERUSED WORDS (top 3)
Find the top 3 most overused words on their website with emojis.

Make it feel personal - like you really read their website in depth and get who they are!

RULES:
- Use simple words and simple English
- Keep sentences short and to the point
- One line answers are okay
- Don't repeat points between sections
- Be specific to their actual website content
- Make it feel human, not AI-generated
- Write like you're chatting to a friend
- Keep it in casual tone, strictly no formal language
- You can use references to their website content in the answers (don't use the same reference again and again)
- Write in second person using "you"
- You should have strong opinions and be slightly polarizing answers.
- Keep sentences short and simple
- Use simple words`;

    try {
      const { partialObjectStream } = streamObject({
        model: anthropic('claude-sonnet-4-20250514'),
        schema: websiteRoastSchema,
        system: "You are a website critic who gives honest feedback. Use simple words and simple English. Keep sentences short and to the point. Don't repeat points between sections. Make sure each section is unique and specific to their website content.",
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
          system: "You are a website critic who gives honest feedback. Use simple words and simple English. Keep sentences short and to the point. Don't repeat points between sections. Make sure each section is unique and specific to their website content.",
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