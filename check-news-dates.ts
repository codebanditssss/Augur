
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkDates() {
    const apiKey = process.env.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/everything?q=India%20News&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;

    console.log('Fetching:', url.split('apiKey=')[0]);
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log('Status:', data.status);
        if (data.articles) {
            data.articles.forEach((a: any, i: number) => {
                console.log(`${i + 1}. [${a.publishedAt}] ${a.title}`);
            });
        }
    } catch (e: any) {
        console.log('Error:', e.message);
    }
}

checkDates();
