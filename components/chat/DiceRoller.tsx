'use client';

import { useState } from 'react';
import { rollDice, commonRolls, type RollResult } from '@/lib/dice';

export function DiceRoller({
  onRoll,
}: {
  onRoll: (notation: string, result: RollResult) => void;
}) {
  const [customNotation, setCustomNotation] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRoll = (notation: string) => {
    try {
      setError(null);
      const result = rollDice(notation);
      onRoll(notation, result);
      setCustomNotation('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to roll dice');
    }
  };

  const handleCustomRoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (customNotation.trim()) {
      handleRoll(customNotation);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {commonRolls.map((roll) => (
          <button
            key={roll.notation}
            onClick={() => handleRoll(roll.notation)}
            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-medium"
          >
            {roll.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleCustomRoll} className="flex gap-2">
        <input
          type="text"
          value={customNotation}
          onChange={(e) => setCustomNotation(e.target.value)}
          placeholder="Custom roll (e.g., 3d6+2)"
          className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-medium"
        >
          Roll
        </button>
      </form>

      {error && (
        <div className="text-xs text-red-600 dark:text-red-400">{error}</div>
      )}
    </div>
  );
}
