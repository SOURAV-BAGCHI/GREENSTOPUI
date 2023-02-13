import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog'; 
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTableModule} from '@angular/material/table';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

const materialModule=[
  MatCardModule,
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatStepperModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSelectModule,
  MatMenuModule,
  MatExpansionModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatTableModule,
  MatRadioModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatSlideToggleModule
];


@NgModule({
  declarations: [],
  imports: [
    materialModule
  ],
  exports:[
    materialModule
  ]
})
export class MaterialModule { }
