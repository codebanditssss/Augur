import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedMarket {
    title: string;
    description: string;
    category: string;
    resolution_date: string;
    resolution_criteria: string;
    initial_probability: number;
    tags: string[];
}

export async function generateMarketsFromNews(headlines: string[]): Promise<GeneratedMarket[]> {
    if (!headlines.length) return [];

    const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const prompt = `
    Today is ${today}.
    You are a prediction market creator for an Indian platform called "augur".
    Given these recent news headlines, generate 5 highly interesting and tradable YES/NO prediction market questions.
    
    Rules for Generation:
    1. Question must be answerable as a clear YES or NO by a specific future date.
    2. Must be highly relevant to Indian users (Politics, Cricket, Bollywood, RBI, Indian Tech/Stocks).
    3. Must have a clear and objective resolution criteria (how the outcome is verified).
    4. Provide an estimated initial probability (0-100) based on current sentiment.
    5. Categories MUST be one of: sports, crypto, finance, politics, technology, entertainment.
    6. Ensure the resolution_date is at least 3 days in the future, but no more than 6 months.

    IMPORTANT: Return the response as a JSON object with a "markets" key containing the array of market objects.
    
    Headlines:
    ${headlines.join('\n')}
  `;

    try {
        console.log(`Generating markets from ${headlines.length} headlines...`);
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert market analyst. You always return results in a JSON object with a 'markets' key." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        if (!content) {
            console.error('OpenAI returned empty content');
            return [];
        }

        const parsed = JSON.parse(content);
        // Handle wrap in "markets" key
        const markets = parsed.markets || (Array.isArray(parsed) ? parsed : []);

        if (markets.length === 0) {
            console.warn('OpenAI returned no markets:', parsed);
        }

        return markets.map((m: any) => ({
            ...m,
            initial_probability: Math.min(Math.max(Number(m.initial_probability) || 50, 5), 95)
        }));
    } catch (error: any) {
        console.error('Error generating markets with OpenAI:', error.message, error.stack);
        return [];
    }
}

export interface ResolutionSuggestion {
    outcome: 'YES' | 'NO' | 'CANCEL';
    reasoning: string;
    confidence: number;
    source_links: string[];
}

export async function suggestMarketResolution(
    marketTitle: string,
    criteria: string,
    news: string[]
): Promise<ResolutionSuggestion | null> {
    const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const prompt = `
    Today is ${today}.
    You are a market resolution assistant for "augur".
    Your job is to determine if a prediction market question has been settled.

    MARKET: "${marketTitle}"
    RESOLUTION CRITERIA: "${criteria}"

    RECENT NEWS RELATING TO THIS TOPIC:
    ${news.join('\n')}

    Rules:
    1. Only suggest YES or NO if the news provides definitive proof based on the criteria.
    2. If the news is inconclusive or the event hasn't happened yet, suggest CANCEL with reasoning "Event not yet final".
    3. Provide clear reasoning and list the news headlines you used.
    4. Provide a confidence score (0.0 to 1.0).

    Return your response as a JSON object with this exact shape:
    {
        "outcome": "YES", "NO", or "CANCEL",
        "reasoning": "string",
        "confidence": 0.0 - 1.0,
        "source_links": ["string"]
    }
  `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a neutral fact-checker. You always return JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    } catch (error) {
        console.error('Error getting resolution suggestion:', error);
        return null;
    }
}
