import { NextRequest } from 'next/server';
import { withAdminAuthentication, createSuccessResponse, createErrorResponse } from '@/lib/server-utils';
import { searchNews } from '@/lib/newsapi';
import { suggestMarketResolution } from '@/lib/openai';

/**
 * POST /api/admin/markets/resolve-suggestion
 * Uses AI to search for news and suggest a resolution outcome for a market
 */
async function resolveSuggestionHandler(user: any, supabase: any, request: NextRequest) {
    try {
        const { marketId } = await request.json();

        if (!marketId) {
            return createErrorResponse('Market ID is required', 400);
        }

        // 1. Fetch market details
        const { data: market, error: marketError } = await supabase
            .from('markets')
            .select('*')
            .eq('id', marketId)
            .single();

        if (marketError || !market) {
            return createErrorResponse('Market not found', 404);
        }

        // 2. Search for relevant news
        // We use the title as the search query
        console.log(`[AI Resolver] Searching news for: ${market.title}`);
        const news = await searchNews(market.title);

        if (!news || news.length === 0) {
            return createErrorResponse('No relevant news articles found to verify this market.', 404);
        }

        const newsHeadlines = news.map(n => `[${n.publishedAt}] [${n.source}] ${n.title} - ${n.description}`);

        // 3. Get AI suggestion
        console.log(`[AI Resolver] Getting AI suggestion for ${marketId}...`);
        const suggestion = await suggestMarketResolution(
            market.title,
            market.resolution_criteria || 'General event outcome',
            newsHeadlines
        );

        if (!suggestion) {
            return createErrorResponse('AI failed to generate a resolution suggestion', 500);
        }

        return createSuccessResponse({
            marketId,
            suggestion
        });

    } catch (error: any) {
        console.error('Market resolution suggestion route error:', error);
        return createErrorResponse(error.message || 'Failed to get resolution suggestion', 500);
    }
}

export const POST = withAdminAuthentication(resolveSuggestionHandler);
