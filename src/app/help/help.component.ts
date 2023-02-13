import { Component, OnInit } from '@angular/core';
import { config } from '../config';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  constructor() { }
  globalsite=config.globalsite;
  termsAndConditions=this.globalsite+'/termsandconditions';
  cancellationPolicy=this.globalsite+'/cancellationpolicy';
  ngOnInit(): void {
  }

}
