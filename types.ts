export interface Player {
  id: number;
  name: string;
  score: number;
}

export enum GameState {
  Setup,
  TurnStart,
  Acting,
  TurnEnd,
  GameOver,
}

export interface Theme {
  title: string;
  words: string[];
}
