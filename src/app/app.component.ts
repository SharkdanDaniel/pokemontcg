import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { IgxDialogComponent, IgxToastComponent } from 'igniteui-angular';
import { ToastService } from './services/toast.service';
import { DialogService } from './services/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('toast') toast!: IgxToastComponent;
  @ViewChild('cardDialog') cardDialog!: IgxDialogComponent;

  private _toastService = inject(ToastService);
  private _dialogService = inject(DialogService);

  title = 'pokemontcg';

  ngAfterViewInit(): void {
    this._toastService.setToast(this.toast);
    this._dialogService.setDialog(this.cardDialog);
  }
}
