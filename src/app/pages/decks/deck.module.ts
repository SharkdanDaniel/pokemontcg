import { NgModule } from '@angular/core';
import { ListDecksComponent } from './list-decks/list-decks.component';
import { DeckRoutingModule } from './deck-routing.module';
import {
  IgxListModule,
  IgxIconModule,
  IgxButtonModule,
  IgxRippleModule,
  IgxDialogModule,
  IgxInputGroupModule,
  IgxProgressBarModule,
  IgxCardModule,
  IgxTooltipModule,
  IgxToastModule,
  IgxAvatarModule,
} from 'igniteui-angular';
import { DeckService } from '../../services/deck.service';
import { EditDeckComponent } from './edit-deck/edit-deck.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DeckDetailComponent } from './deck-detail/deck-detail.component';

@NgModule({
  declarations: [ListDecksComponent, EditDeckComponent, DeckDetailComponent],
  imports: [
    CommonModule,
    RouterModule,
    DeckRoutingModule,
    IgxListModule,
    IgxIconModule,
    IgxButtonModule,
    IgxRippleModule,
    IgxDialogModule,
    ReactiveFormsModule,
    IgxInputGroupModule,
    IgxProgressBarModule,
    IgxCardModule,
    IgxTooltipModule,
    IgxToastModule,
    IgxAvatarModule,
  ],
  providers: [DeckService],
})
export class DeckModule {}
