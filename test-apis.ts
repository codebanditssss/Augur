
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config({ path: '.env.local' });

async function testNews() {
    const apiKey = process.env.NEWS_API_KEY;
    console.log('Testing NewsAPI with key:', apiKey?.substring(0, 5) + '...');
    const url = `https://newsapi.org/v2/top-headlines?country=in&pageSize=1&apiKey=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log('NewsAPI Result:', data.status === 'ok' ? 'SUCCESS' : 'FAILED', data.code || '');
    } catch (e: any) {
        console.log('NewsAPI Error:', e.message);
    }
}

async function testOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('Testing OpenAI with key:', apiKey?.substring(0, 5) + '...');
    const openai = new OpenAI({ apiKey });
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "hi" }],
            max_tokens: 5
        });
        console.log('OpenAI Result: SUCCESS');
    } catch (e: any) {
        console.log('OpenAI Error:', e.message);
    }
}

async function run() {
    await testNews();
    await testOpenAI();
}

run();
