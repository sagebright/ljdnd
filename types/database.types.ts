export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      dndchat_chat_rooms: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      dndchat_chat_room_participants: {
        Row: {
          id: string
          chat_room_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          chat_room_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          chat_room_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      dndchat_messages: {
        Row: {
          id: string
          chat_room_id: string
          user_id: string
          content: string
          message_type: 'text' | 'dice_roll'
          created_at: string
        }
        Insert: {
          id?: string
          chat_room_id: string
          user_id: string
          content: string
          message_type?: 'text' | 'dice_roll'
          created_at?: string
        }
        Update: {
          id?: string
          chat_room_id?: string
          user_id?: string
          content?: string
          message_type?: 'text' | 'dice_roll'
          created_at?: string
        }
      }
      dndchat_dice_rolls: {
        Row: {
          id: string
          message_id: string
          dice_notation: string
          individual_rolls: Json
          modifiers: Json | null
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          dice_notation: string
          individual_rolls: Json
          modifiers?: Json | null
          total: number
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          dice_notation?: string
          individual_rolls?: Json
          modifiers?: Json | null
          total?: number
          created_at?: string
        }
      }
      dndchat_profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
