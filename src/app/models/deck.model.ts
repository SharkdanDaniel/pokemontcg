import { CardModel } from './card.model';

export interface DeckModel {
  id?: string;
  name: string;
  description: string;
  cards?: CardModel[];
}
