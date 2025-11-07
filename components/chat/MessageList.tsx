'use client';

import type { Database } from '@/types/database.types';

type Message = Database['public']['Tables']['messages']['Row'] & {
  profiles: {
    display_name: string | null;
    username: string | null;
  } | null;
  dice_rolls: Database['public']['Tables']['dice_rolls']['Row'][];
};

export function MessageList({
  messages,
  currentUserId,
}: {
  messages: Message[];
  currentUserId: string;
}) {
  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.user_id === currentUserId;
        const displayName =
          message.profiles?.display_name ||
          message.profiles?.username ||
          'Unknown User';

        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md rounded-lg px-4 py-2 ${
                isOwnMessage
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              <div className="text-xs opacity-75 mb-1">{displayName}</div>
              <div className="text-sm">{message.content}</div>
              {message.dice_rolls && message.dice_rolls.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/20 dark:border-gray-700">
                  {message.dice_rolls.map((roll) => (
                    <div key={roll.id} className="text-xs">
                      <div>
                        Rolls:{' '}
                        {Array.isArray(roll.individual_rolls)
                          ? roll.individual_rolls.join(', ')
                          : JSON.stringify(roll.individual_rolls)}
                      </div>
                      <div className="font-bold">Total: {roll.total}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="text-xs opacity-50 mt-1">
                {new Date(message.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
