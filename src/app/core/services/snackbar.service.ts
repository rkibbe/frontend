import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@shared/snackbar/snackbar.component';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    constructor(private snackbar: MatSnackBar) {}

    public openSnackBar(data: SnackBarData): MatSnackBarRef<{}> {
        return this.openCustomSnackBar(SnackbarComponent, data);
    }

    public openCustomSnackBar(component: ComponentType<{}>, data: SnackBarData): MatSnackBarRef<{}> {
        return this.snackbar.openFromComponent(component, {
            verticalPosition: 'top',
            data: data,
            panelClass: 'snackbar-yellow-pannel',
            horizontalPosition: 'center'
        });
    }
}

export interface SnackBarData {
    message: string;
}
