import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'baralhos',
    loadChildren: () =>
      import('./pages/decks/deck.module').then((m) => m.DeckModule),
  },
  {
    path: '404',
    loadChildren: () =>
      import('./pages/404/404.module').then((m) => m.NotFoundModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'baralhos',
  },
  {
    path: '**',
    redirectTo: '404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
