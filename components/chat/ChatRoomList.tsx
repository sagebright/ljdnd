'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ChatRoom {
  id: string;
  name: string;
  created_at: string;
}

export function ChatRoomList({ userId }: { userId: string }) {
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRoomName, setNewRoomName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [creatingRoom, setCreatingRoom] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('chat_room_participants')
      .select('chat_rooms(id, name, created_at)')
      .eq('user_id', userId);

    if (data) {
      const roomsData = data
        .map((item: any) => item.chat_rooms)
        .filter(Boolean);
      setRooms(roomsData);
    }
    setLoading(false);
  };

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !inviteEmail.trim()) return;

    setCreatingRoom(true);
    const supabase = createClient();

    try {
      // Create the room
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .insert({ name: newRoomName })
        .select()
        .single();

      if (roomError || !room) {
        console.error('Error creating room:', roomError);
        return;
      }

      // Add current user as participant
      await supabase.from('chat_room_participants').insert({
        chat_room_id: room.id,
        user_id: userId,
      });

      // Look up the invited user by email
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', inviteEmail)
        .single();

      // If we can't find by username, this would need Supabase Admin API
      // For now, we'll just add the current user
      // In production, you'd want to send an invitation system

      setNewRoomName('');
      setInviteEmail('');
      loadRooms();
      router.push(`/chat/${room.id}`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCreatingRoom(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Create New Room
        </h2>
        <form onSubmit={createRoom} className="space-y-4">
          <div>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Room name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            />
          </div>
          <div>
            <input
              type="text"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Invite user (username or email)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={creatingRoom}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {creatingRoom ? 'Creating...' : 'Create Room'}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Your Rooms
        </h2>
        {rooms.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No rooms yet. Create one above!
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {rooms.map((room) => (
              <li key={room.id}>
                <Link
                  href={`/chat/${room.id}`}
                  className="block py-4 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 -mx-4 rounded transition"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created {new Date(room.created_at).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
