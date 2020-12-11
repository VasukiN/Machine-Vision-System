import { Component, OnInit } from '@angular/core';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import * as deviceLists from '../registered-device.json';
import { MatDialog } from '@angular/material/dialog'
import { HttpClient } from '@angular/common/http';

import { RegisterNewDeviceComponent } from '../register-new-device/register-new-device.component'
import { environment } from 'src/environments/environment.js';


@Component({
  selector: 'app-register-device',
  templateUrl: './register-device.component.html',
  styleUrls: ['./register-device.component.css']
})
export class RegisterDeviceComponent implements OnInit {
  faPlus = faPlus;
  faTrash = faTrash;


  tableProperty = { dataset: [], columns: [] }
  deleteColumns: Array<string> = ['Delete'];
  addedMessage: any;
  deviceValueList: Object;
  tableDeviceValue = { dataset: [], columns: [] };
  // tableProperty: Object;

  constructor(private modalService: MatDialog, private http: HttpClient) { }

  ngOnInit() {
    this.getDeviceList()
    this.getDeviceValues()
  }
  registerNewDevice() {
    let dialogRef = this.modalService.open(RegisterNewDeviceComponent, {
      width: '500px',
      height: 'auto',
      panelClass: 'my-class'
    });
    dialogRef.componentInstance.registerDeviceClicked.subscribe(async newDevice => {
      this.addedMessage = await this.http.post(environment.nodeApi + '/add-device', { device: newDevice[0] }).toPromise();
      await this.http.post(environment.nodeApi+'/add-new-value',{value:newDevice[1]}).toPromise();
      this.getDeviceList();
      this.getDeviceValues();
    })
  }
  async deleteDevice(deviceName) {
    window.alert("Are you sure want to delete?")
    this.addedMessage = await this.http.post(environment.nodeApi + '/delete-device', { device: deviceName }).toPromise();
    this.getDeviceList()
  }
  async deleteCheck(deviceName, checkName) {
    window.alert("Are you sure want to delete?")
    this.addedMessage = await this.http.post(environment.nodeApi + '/delete-device-check', { device: deviceName, check: checkName }).toPromise();
    this.getDeviceList()
  }
  async getDeviceList() {
    let data;
    data = await this.http.get(environment.nodeApi + '/get-devices').toPromise();
    this.tableProperty = { dataset: data.dataset, columns: data.columns }
  }
  async getDeviceValues() {
    this.deviceValueList = await this.http.get(environment.nodeApi + '/get-value-lists').toPromise();
  }
  openValueForCheck(deviceName, checkName) {
    this.tableDeviceValue.dataset = [];
    this.tableDeviceValue.columns = [];
    let pushedArray = []
    let valueObject={}
    const deviceArray = this.deviceValueList['dataset'];
    for(let index = 0; index < deviceArray.length; index++) {
      if(Object.keys(deviceArray[index])[0] === deviceName){
        this.tableDeviceValue.columns = Object.keys(deviceArray[index][deviceName][checkName]);
        valueObject = deviceArray[index][deviceName][checkName]
      }
    }
    for (const key in valueObject) {
      pushedArray.push([valueObject[key]])
    }
    if ([pushedArray][0].length > 1)
      this.tableDeviceValue.dataset = [Array.prototype.concat.apply([], pushedArray)];
    else
      this.tableDeviceValue.dataset = pushedArray
  }
}
