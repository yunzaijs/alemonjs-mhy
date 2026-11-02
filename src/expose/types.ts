import type { MihoyoGame } from '../model/mihoyo/types';

export interface GameInput {
  game: MihoyoGame;
}

export interface UidInput extends GameInput {
  uid: string;
}

export interface QueryInput extends GameInput {
  scheduleType?: number;
  month?: number;
}

export interface CookieCheck {
  game: MihoyoGame;
  bound?: boolean;
  uid?: string;
  retcode?: number | null;
  message?: string;
}

export interface BirthdayClaim {
  name: string;
  imageUrl: string;
  result: string;
}
