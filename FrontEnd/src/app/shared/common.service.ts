import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private snackBar: MatSnackBar) { }
  private isUserLoggedIn = new BehaviorSubject(false)
  currentUserLoggedIn = this.isUserLoggedIn.asObservable();
  changeDownloadReportLinkOption(isLoggedIn: boolean) {
    this.isUserLoggedIn.next(isLoggedIn);
  }
  showMessage(message) {
    this.snackBar.open(message, 'close', {
      duration: 5000,
      panelClass: ['blue-snackbar']
    })
  }
}
