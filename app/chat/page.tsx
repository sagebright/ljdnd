import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ChatRoomList } from '@/components/chat/ChatRoomList';

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Chat Rooms
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Select a room to start chatting
          </p>
        </div>
        <ChatRoomList userId={user.id} />
      </div>
    </div>
  );
}
