import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const { prompt, partnerName } = await request.json()

        const apiKey = process.env.GEMINI_API_KEY

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            )
        }

        const systemPrompt = `You are a warm, thoughtful relationship advisor for a couple's app called Velora. 
Your job is to suggest creative, thoughtful date ideas and activities for couples.

Guidelines:
- Be warm and encouraging, never judgmental
- Suggest practical, achievable ideas
- Include a mix of free/low-cost and special options
- Consider different moods and situations
- Use emojis sparingly but appropriately
- Keep responses concise but meaningful
- Focus on connection and quality time
- The partner's name is: ${partnerName || 'your partner'}

Format your response with:
- A catchy title with an emoji
- A brief description (2-3 sentences)
- 2-3 practical tips or variations
- A warm closing thought

User's request: ${prompt}`

        // Using 'gemini-flash-latest' is the safest alias for your key type
        // It automatically points to the currently available Flash model for your tier
        const modelsToTry = [
            'gemini-flash-latest',
            'gemini-2.0-flash-lite-preview-02-05'
        ];

        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                // Determine API version based on model
                const version = 'v1beta';

                const response = await fetch(
                    `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: systemPrompt }]
                            }]
                        })
                    }
                )

                const data = await response.json()

                // Check specifically for success content
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return NextResponse.json({ suggestion: data.candidates[0].content.parts[0].text });
                }

                // If error, capture it and continue to next model
                if (data.error) {
                    console.warn(`Model ${modelName} failed:`, data.error.message);
                    lastError = data.error.message;

                    // If it's a rate limit (429), we might want to stop trying immediately to avoid ban
                    if (data.error.code === 429) {
                        return NextResponse.json(
                            { error: 'AI usage limit reached. Please wait 1 minute before trying again.' },
                            { status: 429 }
                        );
                    }
                    continue;
                }
            } catch (e: any) {
                console.warn(`Model ${modelName} network error:`, e.message);
                lastError = e.message;
                continue;
            }
        }

        // If we get here, all models failed
        return NextResponse.json(
            { error: `Unable to generate idea. (${lastError})` },
            { status: 503 }
        )

    } catch (error: any) {
        console.error('Gemini API request failed:', error)
        return NextResponse.json(
            { error: error?.message || 'Failed to generate suggestion' },
            { status: 500 }
        )
    }
}
