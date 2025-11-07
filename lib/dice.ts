import { DiceRoll } from '@dice-roller/rpg-dice-roller';

export interface RollResult {
  notation: string;
  rolls: number[];
  modifiers: Record<string, number>;
  total: number;
  output: string;
}

export function rollDice(notation: string): RollResult {
  try {
    const roll = new DiceRoll(notation);

    return {
      notation: notation,
      rolls: roll.rolls.flatMap((r: any) =>
        r.rolls ? r.rolls.map((die: any) => die.value) : []
      ),
      modifiers: roll.rolls
        .filter((r: any) => r.modifiers)
        .reduce((acc: any, r: any) => ({ ...acc, ...r.modifiers }), {}),
      total: roll.total,
      output: roll.output,
    };
  } catch (error) {
    throw new Error(`Invalid dice notation: ${notation}`);
  }
}

export const commonRolls = [
  { label: 'd20', notation: '1d20' },
  { label: 'd20 + 5', notation: '1d20+5' },
  { label: 'd6', notation: '1d6' },
  { label: '2d6', notation: '2d6' },
  { label: 'd100', notation: '1d100' },
  { label: '4d6 drop lowest', notation: '4d6dl1' },
];
