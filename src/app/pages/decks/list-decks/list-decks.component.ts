import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { DeckService } from '../../../services/deck.service';
import { finalize, first } from 'rxjs';
import { IgxDialogComponent } from 'igniteui-angular';
import { DeckModel } from 'src/app/models/deck.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-list-decks',
  templateUrl: './list-decks.component.html',
  styleUrls: ['./list-decks.component.scss'],
})
export class ListDecksComponent implements OnInit {
  @ViewChild('deleteDialog') deleteDialog!: IgxDialogComponent;

  private _deckService = inject(DeckService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _toastService = inject(ToastService);

  protected isBtnLoading = signal(false);
  protected isLoading = signal(false);
  protected decks = signal<DeckModel[]>([]);

  ngOnInit(): void {
    this.getDecks();
  }

  getDecks() {
    this.isLoading.set(true);
    this._deckService
      .getDecks()
      .pipe(
        first(),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe((decks) => {
        this.decks.set(decks);
      });
  }

  openDeleteDialog(id: string) {
    this.deleteDialog.open();
    this.deleteDialog.id = id;
  }

  deleteDeck() {
    this.isBtnLoading.set(true);
    this._deckService
      .deleteDeck(this.deleteDialog.id)
      .pipe(finalize(() => this.isBtnLoading.set(false)))
      .subscribe(() => {
        this._toastService.open('Baralho excluído com sucesso!');
        this.deleteDialog.close();
        this.getDecks();
      });
  }

  navigateToDeck(id: string) {
    this._router.navigate(['./', id], { relativeTo: this._route });
  }
}
