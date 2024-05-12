import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { CardModel } from 'src/app/models/card.model';
import { DeckModel } from 'src/app/models/deck.model';
import { DeckService } from 'src/app/services/deck.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-deck-detail',
  templateUrl: './deck-detail.component.html',
  styleUrls: ['./deck-detail.component.scss'],
})
export class DeckDetailComponent {
  private _route = inject(ActivatedRoute);
  private _deckService = inject(DeckService);
  private _dialogService = inject(DialogService);

  protected deck = signal<DeckModel | null>(null);
  protected pokemonCards = signal<CardModel[]>([]);
  protected pokemonsCount = signal(0);
  protected trainerCards = signal<CardModel[]>([]);
  protected trainersCount = signal(0);
  protected energyCards = signal<CardModel[]>([]);
  protected energiesCount = signal(0);
  protected uniqueTypes = signal<Set<string>>(new Set());

  constructor() {
    const id = this._route.snapshot.paramMap.get('id') || '';
    if (id) this.getDeck(id);
  }

  getDeck(id: string) {
    this._deckService
      .getDeckById(id)
      .pipe(first())
      .subscribe((deck) => this.splitCards(deck));
  }

  splitCards(deck: DeckModel) {
    this.deck.set(deck);
    this.deck()?.cards?.forEach((poke) => {
      switch (poke.supertype) {
        case 'Trainer':
          this.trainerCards.update((value) => {
            const foundTrainer = value.find((t) => t.name === poke.name);
            this.trainersCount.update((value) => ++value);
            if (foundTrainer) {
              foundTrainer.count++;
              return value;
            }
            poke.count = 1;
            value.push(poke);
            return value;
          });
          break;
        case 'Energy':
          this.energyCards.update((value) => {
            const foundEnergy = value.find((e) => e.name === poke.name);
            this.energiesCount.update((value) => ++value);
            if (foundEnergy) {
              foundEnergy.count++;
              return value;
            }
            poke.count = 1;
            value.push(poke);
            return value;
          });
          break;
        default:
          this.pokemonCards.update((value) => {
            const foundPokemon = value.find((p) => p.name === poke.name);
            this.pokemonsCount.update((value) => ++value);
            if (foundPokemon) {
              foundPokemon.count++;
              return value;
            }
            poke.count = 1;
            value.push(poke);
            return value;
          });
          break;
      }
      poke.types?.forEach((type) =>
        this.uniqueTypes.update((value) => {
          value.add(type);
          return value;
        })
      );
    });
  }

  openDialogCard(src: string) {
    if (this._dialogService.dialog()) {
      this._dialogService.dialog()!.id = src;
      this._dialogService.dialog()!.open();
    }
  }
}
