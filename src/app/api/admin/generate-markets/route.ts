import { NextRequest } from 'next/server';
import { withAdminAuthentication, createSuccessResponse, createErrorResponse } from '@/lib/server-utils';
import { fetchAllMarketNews } from '@/lib/newsapi';
import { generateMarketsFromNews, GeneratedMarket } from '@/lib/openai';

/**
 * POST /api/admin/generate-markets
 * Fetches news and generates new market suggestions using AI
 */
async function generateMarketsHandler(user: any, supabase: any, request: NextRequest) {
    try {
        console.log(`[Admin] Market generation requested by: ${user.email}`);
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || undefined;

        // 1. Fetch real news headlines
        console.log('[Admin] Fetching news headlines...');
        const news = await fetchAllMarketNews();

        if (!news || news.length === 0) {
            console.warn('[Admin] No news found');
            return createErrorResponse('No news headlines found to generate markets from', 404);
        }

        console.log(`[Admin] Found ${news.length} headlines. Calling OpenAI...`);
        const headlines = news.map(n => {
            const date = new Date(n.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            return `[${date}] [${n.source}] ${n.title}`;
        });

        // 2. Use AI to generate market objects
        const suggestedMarkets = await generateMarketsFromNews(headlines);

        if (!suggestedMarkets || suggestedMarkets.length === 0) {
            console.error('[Admin] OpenAI returned 0 suggestions');
            return createErrorResponse('AI failed to generate market suggestions', 500);
        }

        console.log(`[Admin] Successfully generated ${suggestedMarkets.length} markets`);
        // 3. Return suggestions for admin review
        return createSuccessResponse({
            count: suggestedMarkets.length,
            suggestions: suggestedMarkets,
            newsCount: news.length
        });

    } catch (error: any) {
        console.error('[Admin] Market generation route FATAL error:', error.message, error.stack);
        return createErrorResponse(error.message || 'Failed to generate markets', 500);
    }
}

export const POST = withAdminAuthentication(generateMarketsHandler);
