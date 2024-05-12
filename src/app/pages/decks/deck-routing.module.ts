import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListDecksComponent } from './list-decks/list-decks.component';
import { EditDeckComponent } from './edit-deck/edit-deck.component';
import { DeckDetailComponent } from './deck-detail/deck-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ListDecksComponent,
  },
  {
    path: 'editar/:id',
    component: EditDeckComponent,
  },
  {
    path: 'detalhes/:id',
    component: DeckDetailComponent,
  },
  {
    path: 'criar',
    component: EditDeckComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeckRoutingModule {}
