import { Injectable, computed, signal } from '@angular/core';
import { IgxDialogComponent } from 'igniteui-angular';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialogRef = signal<IgxDialogComponent | null>(null);

  setDialog(value: IgxDialogComponent | null) {
    if (value) {
      this.dialogRef.set(value);
      this.dialogRef()!.closeOnOutsideSelect = true;
      this.dialogRef()!.closeOnEscape = true;
      this.dialogRef()!
        .closed.asObservable()
        .subscribe(() => (this.dialogRef()!.id = ''));
    }
  }

  public dialog = computed(() => this.dialogRef());
}
