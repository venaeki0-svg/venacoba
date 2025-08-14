/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  // Fail fast so data is not written to a wrong/default project
  throw new Error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password: string
          full_name: string
          role: string
          permissions: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      clients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          since: string
          instagram: string | null
          status: string
          client_type: string
          last_contact: string
          portal_access_id: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      projects: {
        Row: {
          id: string
          project_name: string
          client_name: string
          client_id: string
          project_type: string
          package_name: string
          package_id: string
          add_ons: any[]
          date: string
          deadline_date: string | null
          location: string
          progress: number
          status: string
          active_sub_statuses: string[] | null
          total_cost: number
          amount_paid: number
          payment_status: string
          team: any[]
          notes: string | null
          accommodation: string | null
          drive_link: string | null
          client_drive_link: string | null
          final_drive_link: string | null
          start_time: string | null
          end_time: string | null
          image: string | null
          revisions: any[] | null
          promo_code_id: string | null
          discount_amount: number | null
          shipping_details: string | null
          dp_proof_url: string | null
          printing_details: any[] | null
          printing_cost: number | null
          transport_cost: number | null
          is_editing_confirmed_by_client: boolean | null
          is_printing_confirmed_by_client: boolean | null
          is_delivery_confirmed_by_client: boolean | null
          confirmed_sub_statuses: string[] | null
          client_sub_status_notes: any | null
          sub_status_confirmation_sent_at: any | null
          completed_digital_items: string[] | null
          invoice_signature: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      transactions: {
        Row: {
          id: string
          date: string
          description: string
          amount: number
          type: string
          project_id: string | null
          category: string
          method: string
          pocket_id: string | null
          card_id: string | null
          printing_item_id: string | null
          vendor_signature: string | null
          team_member_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>
      }
      team_members: {
        Row: {
          id: string
          name: string
          role: string
          email: string
          phone: string
          standard_fee: number
          no_rek: string | null
          reward_balance: number
          rating: number
          performance_notes: any[]
          portal_access_id: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['team_members']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>
      }
      packages: {
        Row: {
          id: string
          name: string
          price: number
          physical_items: any[]
          digital_items: string[]
          processing_time: string
          default_printing_cost: number | null
          default_transport_cost: number | null
          photographers: string | null
          videographers: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['packages']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['packages']['Insert']>
      }
      add_ons: {
        Row: {
          id: string
          name: string
          price: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['add_ons']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['add_ons']['Insert']>
      }
      leads: {
        Row: {
          id: string
          name: string
          contact_channel: string
          location: string
          status: string
          date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      cards: {
        Row: {
          id: string
          card_holder_name: string
          bank_name: string
          card_type: string
          last_four_digits: string
          expiry_date: string | null
          balance: number
          color_gradient: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['cards']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['cards']['Insert']>
      }
      financial_pockets: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          type: string
          amount: number
          goal_amount: number | null
          lock_end_date: string | null
          source_card_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['financial_pockets']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['financial_pockets']['Insert']>
      }
      contracts: {
        Row: {
          id: string
          contract_number: string
          client_id: string
          project_id: string
          signing_date: string
          signing_location: string
          client_name1: string
          client_address1: string
          client_phone1: string
          client_name2: string | null
          client_address2: string | null
          client_phone2: string | null
          shooting_duration: string
          guaranteed_photos: string
          album_details: string
          digital_files_format: string
          other_items: string
          personnel_count: string
          delivery_timeframe: string
          dp_date: string
          final_payment_date: string
          cancellation_policy: string
          jurisdiction: string
          vendor_signature: string | null
          client_signature: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['contracts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['contracts']['Insert']>
      }
      assets: {
        Row: {
          id: string
          name: string
          category: string
          purchase_date: string
          purchase_price: number
          serial_number: string | null
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['assets']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['assets']['Insert']>
      }
      client_feedback: {
        Row: {
          id: string
          client_name: string
          satisfaction: string
          rating: number
          feedback: string
          date: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['client_feedback']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['client_feedback']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          title: string
          message: string
          timestamp: string
          is_read: boolean
          icon: string
          link_view: string | null
          link_action: any | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      social_media_posts: {
        Row: {
          id: string
          project_id: string
          client_name: string
          post_type: string
          platform: string
          scheduled_date: string
          caption: string
          media_url: string | null
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['social_media_posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['social_media_posts']['Insert']>
      }
      promo_codes: {
        Row: {
          id: string
          code: string
          discount_type: string
          discount_value: number
          is_active: boolean
          usage_count: number
          max_usage: number | null
          expiry_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['promo_codes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['promo_codes']['Insert']>
      }
      sops: {
        Row: {
          id: string
          title: string
          category: string
          content: string
          last_updated: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['sops']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['sops']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          company_name: string
          website: string
          address: string
          bank_account: string
          authorized_signer: string
          id_number: string | null
          bio: string
          income_categories: string[]
          expense_categories: string[]
          project_types: string[]
          event_types: string[]
          asset_categories: string[]
          sop_categories: string[]
          project_status_config: any[]
          notification_settings: any
          security_settings: any
          briefing_template: string
          terms_and_conditions: string | null
          contract_template: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
    }
  }
}
