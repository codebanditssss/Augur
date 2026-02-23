
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testNews() {
    const apiKey = process.env.NEWS_API_KEY;
    console.log('Testing NewsAPI with key:', apiKey?.substring(0, 5) + '...');

    const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log('Result:', JSON.stringify(data, null, 2));
    } catch (e: any) {
        console.log('Error:', e.message);
    }
}

testNews();
