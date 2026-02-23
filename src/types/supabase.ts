export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          tier: Database["public"]["Enums"]["achievement_tier"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          tier: Database["public"]["Enums"]["achievement_tier"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          tier: Database["public"]["Enums"]["achievement_tier"]
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_trader_stats: {
        Row: {
          avg_return: number | null
          daily_pnl: number | null
          date: string
          return_volatility: number | null
          trades_count: number | null
          user_id: string
          volume: number | null
          win_count: number | null
        }
        Insert: {
          avg_return?: number | null
          daily_pnl?: number | null
          date: string
          return_volatility?: number | null
          trades_count?: number | null
          user_id: string
          volume?: number | null
          win_count?: number | null
        }
        Update: {
          avg_return?: number | null
          daily_pnl?: number | null
          date?: string
          return_volatility?: number | null
          trades_count?: number | null
          user_id?: string
          volume?: number | null
          win_count?: number | null
        }
        Relationships: []
      }
      followers: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
        }
        Relationships: []
      }
      markets: {
        Row: {
          actual_outcome: string | null
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          resolution_date: string | null
          status: string
          tags: string[] | null
          title: string
          total_no_volume: number | null
          total_traders: number | null
          total_volume: number | null
          total_yes_volume: number | null
          updated_at: string
        }
        Insert: {
          actual_outcome?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          resolution_date?: string | null
          status?: string
          tags?: string[] | null
          title: string
          total_no_volume?: number | null
          total_traders?: number | null
          total_volume?: number | null
          total_yes_volume?: number | null
          updated_at?: string
        }
        Update: {
          actual_outcome?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          resolution_date?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          total_no_volume?: number | null
          total_traders?: number | null
          total_volume?: number | null
          total_yes_volume?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          message: string
          metadata: Json | null
          priority: string | null
          read: boolean | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string | null
          read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string | null
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          expires_at: string | null
          filled_cost: number | null
          filled_quantity: number | null
          id: string
          market_id: string
          order_type: string | null
          price: number
          quantity: number
          remaining_quantity: number | null
          side: string
          status: string
          total_cost: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          filled_cost?: number | null
          filled_quantity?: number | null
          id?: string
          market_id: string
          order_type?: string | null
          price: number
          quantity: number
          remaining_quantity?: number | null
          side: string
          status?: string
          total_cost?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          filled_cost?: number | null
          filled_quantity?: number | null
          id?: string
          market_id?: string
          order_type?: string | null
          price?: number
          quantity?: number
          remaining_quantity?: number | null
          side?: string
          status?: string
          total_cost?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_orders_user_balances"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_balances"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          }
        ]
      }
      portfolio_daily_snapshots: {
        Row: {
          active_positions: number | null
          created_at: string | null
          id: string
          snapshot_date: string
          total_invested: number | null
          total_pnl: number | null
          total_value: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_positions?: number | null
          created_at?: string | null
          id?: string
          snapshot_date: string
          total_invested?: number | null
          total_pnl?: number | null
          total_value?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_positions?: number | null
          created_at?: string | null
          id?: string
          snapshot_date?: string
          total_invested?: number | null
          total_pnl?: number | null
          total_value?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      portfolio_snapshots: {
        Row: {
          available_balance: number
          created_at: string
          daily_pnl: number
          id: string
          locked_balance: number
          snapshot_date: string
          total_pnl: number
          total_value: number
          user_id: string
        }
        Insert: {
          available_balance?: number
          created_at?: string
          daily_pnl?: number
          id?: string
          locked_balance?: number
          snapshot_date?: string
          total_pnl?: number
          total_value?: number
          user_id: string
        }
        Update: {
          available_balance?: number
          created_at?: string
          daily_pnl?: number
          id?: string
          locked_balance?: number
          snapshot_date?: string
          total_pnl?: number
          total_value?: number
          user_id?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          available_balance: number
          created_at: string
          daily_pnl: number
          id: string
          locked_balance: number
          total_pnl: number
          total_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_balance?: number
          created_at?: string
          daily_pnl?: number
          id?: string
          locked_balance?: number
          total_pnl?: number
          total_value?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_balance?: number
          created_at?: string
          daily_pnl?: number
          id?: string
          locked_balance?: number
          total_pnl?: number
          total_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_verified: boolean | null
          location: string | null
          reputation_score: number | null
          total_trades: number | null
          total_winnings: number | null
          twitter_handle: string | null
          updated_at: string
          username: string | null
          website: string | null
          win_rate: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          location?: string | null
          reputation_score?: number | null
          total_trades?: number | null
          total_winnings?: number | null
          twitter_handle?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
          win_rate?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          reputation_score?: number | null
          total_trades?: number | null
          total_winnings?: number | null
          twitter_handle?: string | null
          updated_at?: string
          username?: string | null
          website?: string | null
          win_rate?: number | null
        }
        Relationships: []
      }
      realtime_test: {
        Row: {
          created_at: string | null
          id: number
          message: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          message: string
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string
        }
        Relationships: []
      }
      trader_achievements: {
        Row: {
          achievement_id: string
          created_at: string | null
          date_awarded: string | null
          id: string
          trader_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string | null
          date_awarded?: string | null
          id?: string
          trader_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string | null
          date_awarded?: string | null
          id?: string
          trader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trader_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trader_achievements_trader_id_fkey"
            columns: ["trader_id"]
            isOneToOne: false
            referencedRelation: "trader_rankings"
            referencedColumns: ["id"]
          }
        ]
      }
      trader_rankings: {
        Row: {
          avatar: string | null
          created_at: string | null
          id: string
          name: string
          previous_rank: number | null
          return_percentage: number
          skill_rating: number
          timestamp: string | null
          total_value: number
          trade_count: number
          updated_at: string | null
          user_id: string
          win_rate: number
          winning_streak: number
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          name: string
          previous_rank?: number | null
          return_percentage?: number
          skill_rating?: number
          timestamp?: string | null
          total_value?: number
          trade_count?: number
          updated_at?: string | null
          user_id: string
          win_rate?: number
          winning_streak?: number
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          name?: string
          previous_rank?: number | null
          return_percentage?: number
          skill_rating?: number
          timestamp?: string | null
          total_value?: number
          trade_count?: number
          updated_at?: string | null
          user_id?: string
          win_rate?: number
          winning_streak?: number
        }
        Relationships: []
      }
      trades: {
        Row: {
          created_at: string
          id: string
          market_id: string
          no_order_id: string
          no_user_id: string
          no_user_payout: number | null
          price: number
          quantity: number
          status: string
          total_value: number | null
          winner_side: string | null
          winner_user_id: string | null
          yes_order_id: string
          yes_user_id: string
          yes_user_payout: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          market_id: string
          no_order_id: string
          no_user_id: string
          no_user_payout?: number | null
          price: number
          quantity: number
          status?: string
          total_value?: number | null
          winner_side?: string | null
          winner_user_id?: string | null
          yes_order_id: string
          yes_user_id: string
          yes_user_payout?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          market_id?: string
          no_order_id?: string
          no_user_id?: string
          no_user_payout?: number | null
          price?: number
          quantity?: number
          status?: string
          total_value?: number | null
          winner_side?: string | null
          winner_user_id?: string | null
          yes_order_id: string
          yes_user_id: string
          yes_user_payout?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trades_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_no_order_id_fkey"
            columns: ["no_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_yes_order_id_fkey"
            columns: ["yes_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      user_balances: {
        Row: {
          available_balance: number
          created_at: string
          full_name: string | null
          id: string
          locked_balance: number
          total_deposited: number
          total_profit_loss: number
          total_trades: number
          total_volume: number
          total_withdrawn: number
          updated_at: string
          user_id: string
          username: string | null
          winning_trades: number
        }
        Insert: {
          available_balance?: number
          created_at?: string
          full_name?: string | null
          id?: string
          locked_balance?: number
          total_deposited?: number
          total_profit_loss?: number
          total_trades?: number
          total_volume?: number
          total_withdrawn?: number
          updated_at?: string
          user_id: string
          username?: string | null
          winning_trades?: number
        }
        Update: {
          available_balance?: number
          created_at?: string
          full_name?: string | null
          id?: string
          locked_balance?: number
          total_deposited?: number
          total_profit_loss?: number
          total_trades?: number
          total_volume?: number
          total_withdrawn?: number
          updated_at?: string
          user_id?: string
          username?: string | null
          winning_trades?: number
        }
        Relationships: []
      }
      user_notification_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          market_alerts: boolean | null
          order_updates: boolean | null
          promotions: boolean | null
          system_notifications: boolean | null
          trade_confirmations: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          market_alerts?: boolean | null
          order_updates?: boolean | null
          promotions?: boolean | null
          system_notifications?: boolean | null
          trade_confirmations?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          market_alerts?: boolean | null
          order_updates?: boolean | null
          promotions?: boolean | null
          system_notifications?: boolean | null
          trade_confirmations?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_or_create_profile: { Args: never; Returns: Json }
      initialize_user_balance: {
        Args: { p_initial_balance?: number; p_user_id: string }
        Returns: {
          available_balance: number
          id: string
          locked_balance: number
          total_deposited: number
          total_profit_loss: number
          total_trades: number
          total_volume: number
          total_withdrawn: number
          user_id: string
          winning_trades: number
        }[]
      }
      match_order: {
        Args: {
          p_market_id: string
          p_price: number
          p_quantity: number
          p_side: string
          p_user_id: string
        }
        Returns: Json
      }
      place_order_atomic: {
        Args: {
          p_market_id: string
          p_order_cost: number
          p_price: number
          p_quantity: number
          p_side: string
          p_user_id: string
        }
        Returns: Json
      }
      resolve_market: {
        Args: { p_market_id: string; p_outcome: string }
        Returns: Json
      }
      sync_user_statistics: { Args: { user_uuid: string }; Returns: undefined }
      test_realtime_access: { Args: never; Returns: string }
    }
    Enums: {
      achievement_tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      achievement_tier: ["bronze", "silver", "gold", "platinum", "diamond"],
    },
  },
} as const