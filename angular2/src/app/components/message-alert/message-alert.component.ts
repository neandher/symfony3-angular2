import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-message-alert',
  templateUrl: './message-alert.component.html'
})
export class MessageAlertComponent implements OnInit {

  @Input() error: string[] = [];

  constructor() { }

  ngOnInit() {
  }

}
