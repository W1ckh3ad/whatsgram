import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-promise',
  templateUrl: './promise.component.html',
  styleUrls: ['./promise.component.scss'],
})
export class PromiseComponent implements OnInit {
  @Input() promise: Promise<any>;
  result = null;
  error = null;
  constructor() {}

  ngOnInit() {
    this.promise
      .then((res) => {
        this.result = res;
      })
      .catch((error) => {
        this.error = error;
      });
  }
}
