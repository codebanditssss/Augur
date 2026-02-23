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
    You are a prediction market creator for an Indian platform called "YesNoMaybe".
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
