-- Create dndchat_chat_rooms table
CREATE TABLE IF NOT EXISTS public.dndchat_chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create dndchat_chat_room_participants table (junction table for many-to-many)
CREATE TABLE IF NOT EXISTS public.dndchat_chat_room_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_room_id UUID REFERENCES public.dndchat_chat_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(chat_room_id, user_id)
);

-- Create dndchat_messages table
CREATE TABLE IF NOT EXISTS public.dndchat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_room_id UUID REFERENCES public.dndchat_chat_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'dice_roll')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create dndchat_dice_rolls table
CREATE TABLE IF NOT EXISTS public.dndchat_dice_rolls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.dndchat_messages(id) ON DELETE CASCADE NOT NULL,
  dice_notation TEXT NOT NULL,
  individual_rolls JSONB NOT NULL,
  modifiers JSONB,
  total INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create dndchat_profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.dndchat_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.dndchat_chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dndchat_chat_room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dndchat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dndchat_dice_rolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dndchat_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dndchat_chat_rooms
CREATE POLICY "Users can view chat rooms they are part of"
  ON public.dndchat_chat_rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.dndchat_chat_room_participants
      WHERE dndchat_chat_room_participants.chat_room_id = dndchat_chat_rooms.id
      AND dndchat_chat_room_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chat rooms"
  ON public.dndchat_chat_rooms FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for dndchat_chat_room_participants
CREATE POLICY "Users can view participants of their chat rooms"
  ON public.dndchat_chat_room_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.dndchat_chat_room_participants AS crp
      WHERE crp.chat_room_id = dndchat_chat_room_participants.chat_room_id
      AND crp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join chat rooms"
  ON public.dndchat_chat_room_participants FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for dndchat_messages
CREATE POLICY "Users can view messages in their chat rooms"
  ON public.dndchat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.dndchat_chat_room_participants
      WHERE dndchat_chat_room_participants.chat_room_id = dndchat_messages.chat_room_id
      AND dndchat_chat_room_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their chat rooms"
  ON public.dndchat_messages FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.dndchat_chat_room_participants
      WHERE dndchat_chat_room_participants.chat_room_id = dndchat_messages.chat_room_id
      AND dndchat_chat_room_participants.user_id = auth.uid()
    )
  );

-- RLS Policies for dndchat_dice_rolls
CREATE POLICY "Users can view dice rolls in their chat rooms"
  ON public.dndchat_dice_rolls FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.dndchat_messages
      JOIN public.dndchat_chat_room_participants ON dndchat_chat_room_participants.chat_room_id = dndchat_messages.chat_room_id
      WHERE dndchat_messages.id = dndchat_dice_rolls.message_id
      AND dndchat_chat_room_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert dice rolls for their messages"
  ON public.dndchat_dice_rolls FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.dndchat_messages
      WHERE dndchat_messages.id = dndchat_dice_rolls.message_id
      AND dndchat_messages.user_id = auth.uid()
    )
  );

-- RLS Policies for dndchat_profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.dndchat_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.dndchat_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.dndchat_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to handle new user creation for dndchat
CREATE OR REPLACE FUNCTION public.dndchat_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if profile doesn't already exist
  INSERT INTO public.dndchat_profiles (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: We don't create a trigger here because it may conflict with existing triggers
-- Users will need to manually call this function or create profiles on first use
-- Alternatively, profiles will be created on-demand by the application

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.dndchat_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER dndchat_update_chat_rooms_updated_at
  BEFORE UPDATE ON public.dndchat_chat_rooms
  FOR EACH ROW EXECUTE FUNCTION public.dndchat_update_updated_at_column();

CREATE TRIGGER dndchat_update_profiles_updated_at
  BEFORE UPDATE ON public.dndchat_profiles
  FOR EACH ROW EXECUTE FUNCTION public.dndchat_update_updated_at_column();

-- Enable Realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.dndchat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.dndchat_dice_rolls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.dndchat_chat_room_participants;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dndchat_messages_chat_room_id ON public.dndchat_messages(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_dndchat_messages_created_at ON public.dndchat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dndchat_chat_room_participants_user_id ON public.dndchat_chat_room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_dndchat_chat_room_participants_chat_room_id ON public.dndchat_chat_room_participants(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_dndchat_dice_rolls_message_id ON public.dndchat_dice_rolls(message_id);
