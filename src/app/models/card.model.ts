export interface CardModel {
  id: string;
  name: string;
  hp: string;
  level: string;
  number: string;
  rarity: string;
  types: string[];
  supertype: string;
  subtypes: string[];
  images: ImageModel;
  envolvesFrom: string;
  attacks: AttackModel[];
  artist: string;
  abilities: AbilityModel[];
  count: number;
}

interface AbilityModel {
  name: string;
  text: string;
  type: string;
}

interface AttackModel {
  damage: string;
  name: string;
  text: string;
  cost: string[];
}

interface ImageModel {
  large: string;
  small: string;
}
