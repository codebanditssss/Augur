"use client"

import { useState } from 'react';
import {
    Sparkles,
    RefreshCw,
    CheckCircle,
    XSquare,
    AlertTriangle,
    ExternalLink,
    Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface SuggestedMarket {
    title: string;
    description: string;
    category: string;
    resolution_date: string;
    resolution_criteria: string;
    initial_probability: number;
    tags: string[];
}

export default function GenerateMarkets() {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<SuggestedMarket[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setIsGenerating(true);
        setSuggestions([]);

        try {
            const response = await fetch('/api/admin/generate-markets', {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to generate markets');
            }

            const data = await response.json();
            setSuggestions(data.suggestions);
            toast.success(`Generated ${data.suggestions.length} market suggestions from ${data.newsCount} headlines!`);
        } catch (error) {
            console.error('Generation error:', error);
            toast.error('Failed to generate market suggestions. Please try again.');
        } finally {
            setLoading(false);
            setIsGenerating(false);
        }
    };

    const handleApprove = async (market: SuggestedMarket, index: number) => {
        try {
            const response = await fetch('/api/admin/markets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...market,
                    status: 'active'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create market');
            }

            toast.success('Market approved and live!');
            // Remove from suggestions
            setSuggestions(prev => prev.filter((_, i) => i !== index));
        } catch (error) {
            toast.error('Failed to approve market');
        }
    };

    const handleReject = (index: number) => {
        setSuggestions(prev => prev.filter((_, i) => i !== index));
        toast.info('Suggestion dismissed');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                        AI Market Generator
                    </h2>
                    <p className="text-sm text-gray-500">Generate fresh YES/NO markets from latest Indian news headlines</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${loading
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {loading ? 'Analyzing News...' : 'Generate Today\'s Markets'}
                </button>
            </div>

            {suggestions.length > 0 && (
                <div className="grid gap-4">
                    <div className="flex items-center space-x-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100 italic">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>AI suggestions may require review for accuracy before approving.</span>
                    </div>

                    {suggestions.map((market, idx) => (
                        <div key={idx} className="bg-white border rounded-xl p-5 shadow-sm hover:border-purple-200 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                                        {market.category}
                                    </span>
                                    <span className="text-xs text-gray-500 italic">
                                        Est. Prob: {market.initial_probability}%
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleReject(idx)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Reject suggestion"
                                    >
                                        <XSquare className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleApprove(market, idx)}
                                        className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-600 hover:text-white transition-all text-sm font-medium"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1.5" />
                                        Approve & Launch
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-medium text-gray-900 leading-tight mb-2">{market.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{market.description}</p>

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-3 text-xs">
                                <div>
                                    <span className="text-gray-500 block mb-1 font-medium uppercase tracking-tight">Resolution Criteria</span>
                                    <span className="text-gray-900">{market.resolution_criteria}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block mb-1 font-medium uppercase tracking-tight">Target Date</span>
                                    <span className="text-gray-900">{new Date(market.resolution_date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isGenerating && suggestions.length === 0 && !loading && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No suggestions were generated. Try again later.</p>
                </div>
            )}
        </div>
    );
}
