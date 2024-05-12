import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeckService } from '../../../services/deck.service';
import { DeckModel } from 'src/app/models/deck.model';
import {
  EMPTY,
  catchError,
  concatMap,
  debounceTime,
  finalize,
  first,
  of,
  throwError,
} from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { IgxDialogComponent, IgxToastComponent } from 'igniteui-angular';
import { CardModel } from 'src/app/models/card.model';
import { v4 } from 'uuid';
import { ToastService } from 'src/app/services/toast.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-edit-deck',
  templateUrl: './edit-deck.component.html',
  styleUrls: ['./edit-deck.component.scss'],
})
export class EditDeckComponent implements OnInit {
  @ViewChild('cardDialog') cardDialog!: IgxDialogComponent;
  @ViewChild('removeDialog') removeDialog!: IgxDialogComponent;

  private _route = inject(ActivatedRoute);
  private _deckService = inject(DeckService);
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _toastService = inject(ToastService);
  private _dialogService = inject(DialogService);

  protected form = this._formBuilder.group({
    id: [''],
    name: ['', [Validators.required, Validators.maxLength(20)]],
    cards: [[] as CardModel[]],
  });

  protected searchControl = new FormControl('');
  protected isSearching = signal(false);
  protected foundCards = signal<CardModel[]>([]);
  protected isBtnLoading = signal(false);
  protected isEditing = signal(false);

  constructor() {
    const id = this._route.snapshot.paramMap.get('id') || '';
    if (id) this.getDeck(id);
  }

  ngOnInit(): void {
    this.onSearchChanges();
  }

  getDeck(id: string) {
    this.isEditing.set(true);
    this._deckService
      .getDeckById(id)
      .pipe(first())
      .subscribe((deck) => this.patchForm(deck));
  }

  patchForm(deck: DeckModel) {
    this.form.patchValue({
      id: deck.id,
      name: deck.name,
      cards: deck.cards,
    });
  }

  openAddDialog() {
    this.cardDialog.open();
  }

  addCard(card: CardModel) {
    if (this.checkIfCanAddCard(card)) {
      this.form.get('cards')?.value?.push(card);
      this._toastService.open('Carta adicionada ao baralho!');
    }
  }

  openRemoveDialog(id: string) {
    this.removeDialog.open();
    this.removeDialog.id = id;
  }

  removeCard(id: string) {
    this.form.patchValue({
      cards: this.form.get('cards')?.value?.filter((x) => x.id !== id),
    });
    this.removeDialog.close();
  }

  checkIfCanAddCard(card: CardModel) {
    const formCards = this.form.get('cards')?.value;
    if (formCards && formCards.length >= 60) {
      this._toastService.open('Você só pode adicionar até 60 cartas!');
      return false;
    }
    if (
      formCards &&
      formCards.filter((x) => x.name === card.name).length >= 4
    ) {
      this._toastService.open(
        'Você só pode adicionar até 4 cartas com o mesmo nome!'
      );
      return false;
    }
    return true;
  }

  checkIfFormIsValid() {
    const formCards = this.form.get('cards')?.value;
    if (formCards && (formCards.length < 24 || formCards.length > 60)) {
      this._toastService.open(
        'O baralho deve conter no mínimo 24 e no máximo 60 cartas!'
      );
      return false;
    }
    if (this.form.invalid) {
      this._toastService.open(
        'Formulário invalido! Verique os campos novamente.'
      );
      return false;
    }
    return true;
  }

  onSearchChanges() {
    this.searchControl?.valueChanges
      .pipe(debounceTime(500))
      .subscribe((res) => {
        this.foundCards.set([]);
        if (!res) return;
        this.searchRequest(res);
      });
  }

  searchRequest(terms: string) {
    this.isSearching.set(true);
    this._deckService
      .searchCard(terms || '')
      .pipe(
        first(),
        catchError(() => {
          this._toastService.open('Erro! Tente digitar sem espaços');
          return of([]);
        }),
        finalize(() => this.isSearching.set(false))
      )
      .subscribe((res) => {
        this.isSearching.set(false);
        this.foundCards.set(res);
      });
  }

  openDialogCard(src: string) {
    if (this._dialogService.dialog()) {
      this._dialogService.dialog()!.id = src;
      this._dialogService.dialog()!.open();
    }
  }

  closeDialog() {
    this.foundCards.set([]);
    this.searchControl.reset();
    this.cardDialog.close();
  }

  submit() {
    if (this.checkIfFormIsValid()) {
      const { id, name, cards } = this.form.getRawValue();
      const deck = { id: id || v4(), name, cards } as DeckModel;
      this.isBtnLoading.set(true);
      this._deckService[this.isEditing() ? 'updateDeck' : 'createDeck'](deck)
        .pipe(
          first(),
          finalize(() => this.isBtnLoading.set(false))
        )
        .subscribe(() => {
          this._router.navigate(['/']);
          this._toastService.open(
            `Baralho ${this.isEditing() ? 'atualizado' : 'criado'} com sucesso!`
          );
        });
    }
  }
}
