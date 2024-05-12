import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CardModel } from 'src/app/models/card.model';
import { DeckModel } from 'src/app/models/deck.model';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class DeckService {
  private _http = inject(HttpClient);

  getDecks(): Observable<DeckModel[]> {
    return new Observable((subs) => {
      try {
        const storage = localStorage.getItem('tcg');
        if (!storage) {
          localStorage.setItem('tcg', JSON.stringify([]));
          subs.next([]);
          subs.complete();
        }
        const decks = JSON.parse(storage!);
        subs.next(decks);
        subs.complete();
      } catch (error) {
        subs.error(error);
      }
    });
  }

  getDeckById(id: string): Observable<DeckModel> {
    return new Observable((subs) => {
      try {
        const decks = JSON.parse(localStorage.getItem('tcg') || '');
        subs.next(decks.find((deck: any) => deck.id === id));
        subs.complete();
      } catch (error) {
        subs.error(error);
      }
    });
  }

  createDeck(deck: DeckModel) {
    return new Observable((subs) => {
      try {
        const decks = JSON.parse(localStorage.getItem('tcg') || '');
        decks.push(deck);
        localStorage.setItem('tcg', JSON.stringify(decks));
        subs.next();
        subs.complete();
      } catch (error) {
        subs.error(error);
      }
    });
  }
  updateDeck(deck: DeckModel) {
    return new Observable((subs) => {
      try {
        let decks = JSON.parse(localStorage.getItem('tcg') || '');
        decks = decks.map((x: DeckModel) => {
          if (x.id === deck.id) return deck;
          return x;
        });
        localStorage.setItem('tcg', JSON.stringify(decks));
        subs.next();
        subs.complete();
      } catch (error) {
        subs.error(error);
      }
    });
  }

  deleteDeck(id: string) {
    return new Observable((subs) => {
      try {
        let decks = JSON.parse(localStorage.getItem('tcg') || '');
        decks = decks.filter((deck: any) => deck.id !== id);
        localStorage.setItem('tcg', JSON.stringify(decks));
        subs.next();
        subs.complete();
      } catch (error) {
        subs.error(error);
      }
    });
  }

  searchCard(terms: string) {
    terms = terms.trim();
    return this._http
      .get<{ data: CardModel[] }>(
        `${environment.apiURL}/cards/?q=(name:*${terms}* 
        OR number:${terms} 
        OR artist:*${terms}* 
        OR attacks:${terms} 
        OR abilities:*${terms}* 
        OR hp:${terms} 
        OR level:${terms} 
        OR supertype:*${terms}* 
        OR types:*${terms}*)
        &page=1&pageSize=100&orderBy=number`
      )
      .pipe(map(({ data }) => data));
  }
}
