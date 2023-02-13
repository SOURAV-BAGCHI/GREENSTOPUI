import { Component, OnInit } from '@angular/core';
import { config } from '../config';

@Component({
  selector: 'app-termsandconditions',
  templateUrl: './termsandconditions.component.html',
  styleUrls: ['./termsandconditions.component.css']
})
export class TermsandconditionsComponent implements OnInit {

  constructor() { }
  globalsite=config.globalsite;
  cancellation_policy:string="cancellation_policy";
  ngOnInit(): void {
  }

}
