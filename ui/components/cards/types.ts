export interface Card {
  id: string;
  front: string;
  back: string;
}

export interface Stack {
  id: string;
  name: string;
  cardIds: string[];
} 