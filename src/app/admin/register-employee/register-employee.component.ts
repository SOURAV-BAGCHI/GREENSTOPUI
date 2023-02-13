import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, filter } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AccountService } from 'src/app/service/account.service';
import { Register } from 'src/app/models/register';

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.css']
})
export class RegisterEmployeeComponent implements OnInit {

  constructor(private _formBuilder: FormBuilder,
              private _snackBar: MatSnackBar,
              private account:AccountService) { }
  isloadingData:boolean=false;

  registerFormGroup:FormGroup;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  // emailFormControl = new FormControl('', [
  //   Validators.required,
  //   Validators.email,
  // ]);

  // nameFormControl = new FormControl('', [
  //   Validators.required
  // ]);

  // myControl = new FormControl('',
  // [Validators.required
  // ]);

  options: any[] = [
    {name: 'ITAdmin'},
    {name: 'ChiefManager'},
    {name: 'CustomerService'},
    {name: 'KitchenManager'},
    {name: 'Delivery'}
  ];
  filteredOptions: Observable<any[]>;

  ngOnInit(): void {
    // this.filteredOptions = this.myControl.valueChanges
    // .pipe(
    //   startWith(''),
    //   map(value => typeof value === 'string' ? value : value.name),
    //   map(name => name ? this._filter(name) : this.options.slice())
    // );

    this.registerFormGroup=this._formBuilder.group({
      phoneCtrl: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^[0-9]*$")]],
      nameCtrl:['',[Validators.required,Validators.maxLength(50)]],
      roleCtrl:['',[Validators.required,Validators.maxLength(50)]],
      passwordCtrl:['',[Validators.required,Validators.maxLength(20)]]
    });

    this.filteredOptions = this.registerFormGroup.controls.roleCtrl.valueChanges
     .pipe(
      startWith(''),
      filter(res=>res!=null),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options.slice())
    );

  }

  displayFn(user: any): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  onSubmit():void{
    
    if(this.registerFormGroup.valid)
    {
      this.isloadingData=true;
      // setTimeout(() => {
      //   this.isloadingData=false;
      //   this.openSnackBar('User registered successfully','Success');
      //   this.registerFormGroup.reset();
      // }, 1000);
    //  console.log('Submitted');

      // let data:Register={Phone:this.registerFormGroup.controls.phoneCtrl.value,
      //   Displayname:this.registerFormGroup.controls.nameCtrl.value,
      //   Password:this.registerFormGroup.controls.passwordCtrl.value,
      //   Role:this.registerFormGroup.controls.roleCtrl.value};

      let data:Register= {"Phone":this.registerFormGroup.controls.phoneCtrl.value,
      "Displayname":this.registerFormGroup.controls.nameCtrl.value,
      "Password":this.registerFormGroup.controls.passwordCtrl.value,
      "Role":this.registerFormGroup.controls.roleCtrl.value.name};

      this.account.register(data).subscribe(res=>{
        this.isloadingData=false;
        this.openSnackBar('User registered successfully','Success');
        this.registerFormGroup.reset();

      },
      error=>{
        this.isloadingData=false;
        this.openSnackBar('Registration unsuccessful','Error');
      })
      
    }
  }


  openSnackBar(msg:string,msg2:string) {
  //  let msg=(this.itemCount>1?this.itemCount+' items':this.itemCount+' item');
    
    this._snackBar.open( msg, msg2, {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

    // this._snackBar._openedSnackBarRef.onAction().subscribe(
    //   ()=>{
    //     this.openCart();
    //   }
    // )
  }
}
