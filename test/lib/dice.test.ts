import { describe, it, expect } from 'vitest';
import { rollDice, commonRolls } from '@/lib/dice';

describe('Dice Roller', () => {
  describe('rollDice', () => {
    it('should roll a single d20', () => {
      const result = rollDice('1d20');
      expect(result.notation).toBe('1d20');
      expect(result.rolls).toHaveLength(1);
      expect(result.rolls[0]).toBeGreaterThanOrEqual(1);
      expect(result.rolls[0]).toBeLessThanOrEqual(20);
      expect(result.total).toBe(result.rolls[0]);
    });

    it('should roll multiple dice', () => {
      const result = rollDice('2d6');
      expect(result.notation).toBe('2d6');
      expect(result.rolls).toHaveLength(2);
      result.rolls.forEach((roll) => {
        expect(roll).toBeGreaterThanOrEqual(1);
        expect(roll).toBeLessThanOrEqual(6);
      });
    });

    it('should handle modifiers', () => {
      const result = rollDice('1d20+5');
      expect(result.notation).toBe('1d20+5');
      expect(result.total).toBeGreaterThanOrEqual(6);
      expect(result.total).toBeLessThanOrEqual(25);
    });

    it('should throw error for invalid notation', () => {
      expect(() => rollDice('invalid')).toThrow('Invalid dice notation');
    });
  });

  describe('commonRolls', () => {
    it('should have standard D&D rolls', () => {
      expect(commonRolls).toContainEqual({ label: 'd20', notation: '1d20' });
      expect(commonRolls).toContainEqual({ label: 'd6', notation: '1d6' });
      expect(commonRolls).toContainEqual({ label: '2d6', notation: '2d6' });
    });
  });
});
