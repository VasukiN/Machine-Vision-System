import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { CommonService } from '../shared/common.service';


@Component({
  selector: 'app-add-new-check',
  templateUrl: './add-new-check.component.html',
  styleUrls: ['./add-new-check.component.css']
})
export class AddNewCheckComponent implements OnInit {
  enteredCheckName: string;
  enteredDescription: string;
  @Output() addDeviceClicked = new EventEmitter<any>();
  constructor(private service: CommonService) { }

  ngOnInit() {  

  }
  addDevice() {
    this.addDeviceClicked.emit({ CheckName: this.enteredCheckName, Description: this.enteredDescription });
  }
}
