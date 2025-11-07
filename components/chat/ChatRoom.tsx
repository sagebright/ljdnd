'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DiceRoller } from './DiceRoller';
import { MessageList } from './MessageList';
import type { Database } from '@/types/database.types';

type Message = Database['public']['Tables']['dndchat_messages']['Row'] & {
  dndchat_profiles: {
    display_name: string | null;
    username: string | null;
  } | null;
  dndchat_dice_rolls: Database['public']['Tables']['dndchat_dice_rolls']['Row'][];
};

export function ChatRoom({ roomId, userId }: { roomId: string; userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    subscribeToMessages();
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('dndchat_messages')
      .select(
        `
        *,
        dndchat_profiles:user_id(display_name, username),
        dndchat_dice_rolls(*)
      `
      )
      .eq('chat_room_id', roomId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data as Message[]);
    }
    setLoading(false);
  };

  const subscribeToMessages = () => {
    const supabase = createClient();
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dndchat_messages',
          filter: `chat_room_id=eq.${roomId}`,
        },
        async (payload) => {
          // Fetch the full message with relations
          const { data } = await supabase
            .from('dndchat_messages')
            .select(
              `
              *,
              dndchat_profiles:user_id(display_name, username),
              dndchat_dice_rolls(*)
            `
            )
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages((current) => [...current, data as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const supabase = createClient();
    await supabase.from('dndchat_messages').insert({
      chat_room_id: roomId,
      user_id: userId,
      content: newMessage,
      message_type: 'text',
    });

    setNewMessage('');
  };

  const handleDiceRoll = async (notation: string, result: any) => {
    const supabase = createClient();

    // Insert message
    const { data: message } = await supabase
      .from('dndchat_messages')
      .insert({
        chat_room_id: roomId,
        user_id: userId,
        content: `Rolled ${notation}: ${result.output}`,
        message_type: 'dice_roll',
      })
      .select()
      .single();

    if (message) {
      // Insert dice roll data
      await supabase.from('dndchat_dice_rolls').insert({
        message_id: message.id,
        dice_notation: notation,
        individual_rolls: result.rolls,
        modifiers: result.modifiers,
        total: result.total,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow px-4 py-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Chat Room
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} currentUserId={userId} />
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <DiceRoller onRoll={handleDiceRoll} />

        <form onSubmit={sendMessage} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
