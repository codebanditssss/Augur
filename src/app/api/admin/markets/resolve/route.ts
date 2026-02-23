import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuthentication, createErrorResponse, createSuccessResponse } from '@/lib/server-utils';
import { supabaseAdmin } from '@/lib/supabase';

async function resolveMarketHandler(user: any, supabase: any, request: NextRequest) {
    try {
        if (!supabaseAdmin) {
            return createErrorResponse('Admin client not configured', 500);
        }

        const { marketId, outcome } = await request.json();

        if (!marketId || !outcome) {
            return createErrorResponse('Market ID and outcome are required', 400);
        }

        const validOutcomes = ['YES', 'NO', 'CANCEL'];
        if (!validOutcomes.includes(outcome)) {
            return createErrorResponse('Invalid outcome. Must be YES, NO, or CANCEL', 400);
        }

        // Call the resolve_market RPC
        // This function handles updating the market status, setting actual_outcome, 
        // and potentially distributing payouts/liquidating orders.
        const { data, error } = await supabaseAdmin.rpc('resolve_market', {
            p_market_id: marketId,
            p_outcome: outcome
        });

        if (error) {
            console.error('Resolution RPC error:', error);
            return createErrorResponse(error.message || 'Failed to resolve market', 500);
        }

        console.log(`Admin ${user.email} resolved market ${marketId} as ${outcome}`);

        return createSuccessResponse({
            success: true,
            data,
            message: `Market resolved successfully as ${outcome}`
        });

    } catch (error) {
        console.error('Resolve market API error:', error);
        return createErrorResponse('Internal server error', 500);
    }
}

export const POST = withAdminAuthentication(resolveMarketHandler);
