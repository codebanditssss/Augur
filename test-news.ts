
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config({ path: '.env.local' });

async function testNews() {
    const apiKey = process.env.NEWS_API_KEY;
    console.log('Testing NewsAPI with key:', apiKey?.substring(0, 5) + '...');

    const categories = ['business', 'sports', 'technology', 'entertainment'];
    for (const cat of categories) {
        const url = `https://newsapi.org/v2/top-headlines?country=in&category=${cat}&pageSize=1&apiKey=${apiKey}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            console.log(`NewsAPI (${cat}):`, data.status === 'ok' ? `SUCCESS (${data.totalResults} results)` : `FAILED (${data.message})`);
        } catch (e: any) {
            console.log(`NewsAPI (${cat}) Error:`, e.message);
        }
    }
}

testNews();
