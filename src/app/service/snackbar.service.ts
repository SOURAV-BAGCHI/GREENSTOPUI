import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private router:Router,
    private _snackBar: MatSnackBar) { }

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom'; 

  openSnackBar(message:string,messagetype:string) {
    let msg=message;
    
    this._snackBar.open( msg, messagetype, {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

    // if(messagetype=='Login')
    // {
    //   this._snackBar._openedSnackBarRef.onAction().subscribe(
    //     ()=>{
    //       this.onNoClick();
    //     //  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    //       // this.activity.openCapcha$.next(true);
    //       this.router.navigateByUrl('/user/login');
    //     }
    //   )
    // }
    
  }
}
