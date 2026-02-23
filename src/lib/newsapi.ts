export interface NewsArticle {
    title: string;
    description: string;
    url: string;
    source: string;
    publishedAt: string;
    category: string;
}

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

export async function fetchNewsHeadlines(category: string = 'general'): Promise<NewsArticle[]> {
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        console.error('Missing NEWS_API_KEY environment variable');
        return [];
    }

    try {
        // Map our app categories to NewsAPI categories
        const apiCategory = category === 'politics' || category === 'finance' ? 'business' :
            category === 'crypto' ? 'technology' : category;

        const url = `${NEWS_API_BASE_URL}/top-headlines?country=in&category=${apiCategory}&pageSize=10&apiKey=${apiKey}`;

        let response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

        if (!response.ok) {
            const errorData = await response.json();
            console.error('NewsAPI Error:', errorData);
            return [];
        }

        let data = await response.json();

        // FALLBACK: If top-headlines returns nothing (happens for country='in' sometimes)
        // search 'everything' for major Indian news keywords
        if ((!data.articles || data.articles.length === 0) && category === 'general') {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const fromDate = sevenDaysAgo.toISOString().split('T')[0];

            const fallbackUrl = `${NEWS_API_BASE_URL}/everything?q=India%20News&from=${fromDate}&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;
            console.log(`[NewsAPI] Falling back to everything search from ${fromDate}...`);
            const fallbackRes = await fetch(fallbackUrl);
            if (fallbackRes.ok) {
                data = await fallbackRes.json();
            }
        }

        return (data.articles || []).map((article: any) => ({
            title: article.title,
            description: article.description || article.content || '',
            url: article.url,
            source: article.source?.name || 'Unknown',
            publishedAt: article.publishedAt,
            category: category
        }));
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

export async function fetchAllMarketNews(): Promise<NewsArticle[]> {
    const categories = ['business', 'sports', 'technology', 'entertainment'];

    const newsPromises = categories.map(cat => fetchNewsHeadlines(cat));
    const results = await Promise.all(newsPromises);

    let allNews = results.flat();

    // If still nothing, try one last broad search for "Indian politics finance news"
    if (allNews.length === 0) {
        console.log('[NewsAPI] Categories all empty, trying broad keyword search...');
        const apiKey = process.env.NEWS_API_KEY;
        const broadUrl = `${NEWS_API_BASE_URL}/everything?q=India%20Politics%20OR%20Cricket%20OR%20Business&sortBy=relevancy&pageSize=15&apiKey=${apiKey}`;
        const res = await fetch(broadUrl);
        if (res.ok) {
            const data = await res.json();
            allNews = (data.articles || []).map((article: any) => ({
                title: article.title,
                description: article.description || article.content || '',
                url: article.url,
                source: article.source?.name || 'Unknown',
                publishedAt: article.publishedAt,
                category: 'general'
            }));
        }
    }

    return allNews;
}
