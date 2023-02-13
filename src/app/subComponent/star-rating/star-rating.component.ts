import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mat-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent implements OnInit {

  @Input('rating')  rating: number = 3;
  @Input('starCount')  starCount: number = 5;
  @Input('color')  color: string = 'warn';
  @Output() private ratingUpdated=new EventEmitter();

  ratingArr = [];
  ratingMeaning=['Bad','Ok','Average','Good','Very good'];
  constructor() { }

  ngOnInit(): void {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  onClick(rating:number) {
    this.ratingUpdated.emit(rating);
    return false;
  }

  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

}
