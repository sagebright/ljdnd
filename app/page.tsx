import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/chat');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="text-center text-white p-8">
        <h1 className="text-6xl font-bold mb-4">LJDND</h1>
        <p className="text-xl mb-8">D&D Chat & Dice Roller</p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-purple-800 text-white rounded-lg font-semibold hover:bg-purple-900 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
