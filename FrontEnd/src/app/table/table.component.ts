import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { faTrash } from '@fortawesome/free-solid-svg-icons'



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() dataset:Array<string>=[]
  @Input() columns:Array<string>=[]
  @Input() deleteColumns:Array<string>=[];
  @Output() sendResponse:EventEmitter<any> = new EventEmitter()
  faTrash=faTrash
  constructor() { }

  ngOnInit() {
  }
  deleteCheck(event){
    this.sendResponse.emit({checkName:event[0]})
  }

}
