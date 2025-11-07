import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to LJDND
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            D&D Chat & Dice Roller
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
