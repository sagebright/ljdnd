import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ChatRoom } from '@/components/chat/ChatRoom';

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verify user has access to this room
  const { data: participant } = await supabase
    .from('dndchat_chat_room_participants')
    .select('*')
    .eq('chat_room_id', roomId)
    .eq('user_id', user.id)
    .single();

  if (!participant) {
    redirect('/chat');
  }

  return <ChatRoom roomId={roomId} userId={user.id} />;
}
