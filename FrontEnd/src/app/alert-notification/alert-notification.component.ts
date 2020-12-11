import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert-notification',
  templateUrl: './alert-notification.component.html',
  styleUrls: ['./alert-notification.component.css']
})
export class AlertNotificationComponent implements OnInit {
  @Input() message:string;
  constructor() { }

  ngOnInit() {
  }

}
