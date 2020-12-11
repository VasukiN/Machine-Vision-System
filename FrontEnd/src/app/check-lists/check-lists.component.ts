import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { MatDialog } from '@angular/material/dialog'
import { HttpClient } from '@angular/common/http';

import { AddNewCheckComponent } from '../add-new-check/add-new-check.component';
import { CommonService } from '../shared/common.service.js';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-check-lists',
  templateUrl: './check-lists.component.html',
  styleUrls: ['./check-lists.component.css']
})
export class CheckListsComponent implements OnInit {
  faPlus = faPlus;
  tableProperty = {}
  deleteColumns: Array<string> = ['Delete'];
  addedMessage: any;

  constructor(private modalService: MatDialog, private service: CommonService, private http: HttpClient) { }

  ngOnInit() {
    this.loadCheckLists();
  }
  async addNewCheck() {
    let dialogRef = this.modalService.open(AddNewCheckComponent, {
      width: '500px',
      height: 'auto',
    });
    dialogRef.componentInstance.addDeviceClicked.subscribe(async newCheck => {
      this.addedMessage = await this.http.post(environment.nodeApi + '/add-checklists', { check: newCheck }).toPromise();
      this.loadCheckLists();
    });
  }

  async deleteCheck(event) {
    window.alert("Are you sure want to delete?")
    this.addedMessage = await this.http.post(environment.nodeApi + '/delete-checklists', { checkName: event['checkName'] }).toPromise();
    this.addedMessage !== '' ? this.service.showMessage(this.addedMessage) : this.service.showMessage('Something went wrong')
    this.loadCheckLists();
  }
  async loadCheckLists() {
    this.tableProperty = await this.http.get(environment.nodeApi + '/get-checklists').toPromise();
  }
}
