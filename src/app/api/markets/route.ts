import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const category = searchParams.get('category') || 'all';
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    // Build query with filters
    let query = supabase
      .from('markets')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('total_volume', { ascending: false })
      .limit(limit);

    // Apply filters
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (category !== 'all') {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    const { data: markets, error } = await query;

    if (error) {
      console.error('Error fetching markets:', error);
      return NextResponse.json(
        { error: 'Failed to fetch markets' },
        { status: 500 }
      );
    }

    // Transform database data to match frontend Market interface
    const transformedMarkets = markets?.map(market => {
      // Calculate current market prices based on volume ratio
      const totalVolume = market.total_volume || 0;
      const yesVolume = market.total_yes_volume || 0;
      const noVolume = market.total_no_volume || 0;

      // Calculate probability-based prices (simplified)
      let yesPrice = 50; // Default 50/50
      let noPrice = 50;

      if (totalVolume > 0) {
        const yesRatio = yesVolume / totalVolume;
        yesPrice = Math.round((yesRatio * 80 + 10) * 10) / 10; // Scale to 10-90 range
        noPrice = Math.round((100 - yesPrice) * 10) / 10;
      }

      // Use real DB volume as 24h volume proxy (no random values)
      // priceChange is 0 until we have a price_history table to diff against
      const priceChange = 0;
      const volume24h = totalVolume; // Real cumulative volume from DB

      // Determine if market is trending (high volume or recent activity)
      const isTrending = totalVolume > 10000 || market.is_featured;

      // Calculate days until expiry for status
      const now = new Date();
      const expiryDate = market.resolution_date ? new Date(market.resolution_date) : null;
      const daysUntilExpiry = expiryDate
        ? Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : Infinity;

      let marketStatus: 'active' | 'closing_soon' | 'resolved' = market.status as any;
      if (market.status === 'active' && daysUntilExpiry <= 7) {
        marketStatus = 'closing_soon';
      }

      // Calculate real last update time from DB updated_at field
      const lastUpdate = formatTimeAgo(market.updated_at || market.created_at);

      return {
        id: market.id,
        title: market.title,
        category: market.category || 'general',
        description: market.description,
        traders: market.total_traders || 0,
        volume: totalVolume >= 1000
          ? `₹${(totalVolume / 1000).toFixed(1)}K`
          : `₹${totalVolume.toFixed(0)}`,
        volume24h: volume24h,
        yesPrice: yesPrice,
        noPrice: noPrice,
        priceChange: priceChange,
        priceChangePercent: 0, // 0 until price_history table exists
        lastUpdate: lastUpdate,
        trending: isTrending,
        icon: getCategoryIcon(market.category || 'general'),
        status: marketStatus,
        expiryDate: market.resolution_date ? new Date(market.resolution_date) : null,
        totalLiquidity: totalVolume,
        marketCap: totalVolume,
        createdAt: new Date(market.created_at),
        tags: market.tags || [],
        featured: market.is_featured || false,
        riskLevel: calculateRiskLevel(daysUntilExpiry, market.category || 'general'),
        probability: yesPrice
      };
    }) || [];

    return NextResponse.json(transformedMarkets);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get category icon (simplified)
function getCategoryIcon(category: string) {
  const iconMap: Record<string, string> = {
    'crypto': 'Bitcoin',
    'technology': 'Activity',
    'sports': 'Trophy',
    'finance': 'TrendingUp',
    'economics': 'TrendingUp',
    'politics': 'Building',
    'entertainment': 'Tv'
  };
  return iconMap[category] || 'Globe';
}

// Helper function to calculate risk level
function calculateRiskLevel(daysUntilExpiry: number, category: string): 'low' | 'medium' | 'high' {
  if (!isFinite(daysUntilExpiry) || daysUntilExpiry === Infinity) return 'low';
  if (daysUntilExpiry <= 30) return 'high';
  if (daysUntilExpiry <= 180) return 'medium';
  return 'low';
}

// Helper to convert a timestamp into a human-readable "X mins ago" string
function formatTimeAgo(timestamp: string | null | undefined): string {
  if (!timestamp) return 'Just now';
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`;
  return `${days} day${days === 1 ? '' : 's'} ago`;
}