
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testNews() {
    const apiKey = process.env.NEWS_API_KEY;

    const urls = [
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`,
        `https://newsapi.org/v2/everything?q=India&pageSize=5&apiKey=${apiKey}`
    ];

    for (const url of urls) {
        console.log('Testing URL:', url.split('apiKey=')[0]);
        try {
            const res = await fetch(url);
            const data = await res.json();
            console.log('Status:', data.status, 'Total:', data.totalResults);
        } catch (e: any) {
            console.log('Error:', e.message);
        }
    }
}

testNews();
