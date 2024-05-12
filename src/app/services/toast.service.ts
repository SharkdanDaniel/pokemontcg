import { Injectable, signal } from '@angular/core';
import { IgxToastComponent, PositionSettings } from 'igniteui-angular';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastRef = signal<IgxToastComponent | null>(null);

  setToast(value: IgxToastComponent | null) {
    this.toastRef.set(value);
  }

  open(message?: string, settings?: PositionSettings | undefined) {
    return this.toastRef()?.open(message, settings);
  }
}
