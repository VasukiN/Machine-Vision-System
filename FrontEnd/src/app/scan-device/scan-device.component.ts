import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

// import * as devicesLists from '../registered-device.json'
// import * as deviceValueList from '../value-list.json'
import { environment } from '../../environments/environment';
import { CommonService } from '../shared/common.service.js';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json',
//   })
// };

@Component({
  selector: 'app-scan-device',
  templateUrl: './scan-device.component.html',
  styleUrls: ['./scan-device.component.css']
})
export class ScanDeviceComponent implements OnInit {
  sizeOfProduct = {};
  measurementCheck: string = '';
  selectedDeviceName: string = 'Choose device...';
  imageName: string = 'Choose File';
  existingDevice: boolean = true;
  isScanComplete: boolean = false;
  scannedResult = [{ deviceName: '', selectedChecks: [] }];
  testedChecks: Array<string> = ['Scan Result']
  currentDeviceLists: Array<string> = [];
  tableDeviceValue = { dataset: [], columns: [] };
  tableDeviceValueScanned = { dataset: [], columns: [] }
  deviceList: Array<string> = []
  scannedResultValues = {};
  faCheck = faCheck;
  faTimes = faTimes;
  deviceValueList: Object;
  constructor(private http: HttpClient, private service: CommonService) { }

  async ngOnInit() {
    let data;
    data = await this.http.get(environment.nodeApi + '/get-devices').toPromise();
    if (data.hasOwnProperty('dataset')) {
      this.deviceList = data.array;
      for (let i = 0; i < data.dataset.length; i++) {
        this.currentDeviceLists.push(data.dataset[i][0])
      }
    }
    this.getDeviceValues()
  }

  async scanDevice() {
    let index = this.deviceList.findIndex(x => x['DeviceName'] === this.selectedDeviceName)
    if (index > -1 && this.imageName !== 'Choose File') {
      this.scannedResult[0].deviceName=''
      this.scannedResult[0].selectedChecks=[]
      this.scannedResultValues={}
      this.scannedResult[0].deviceName = this.selectedDeviceName;
      this.scannedResultValues[this.selectedDeviceName] = {}
      for (let check = 0; check < this.deviceList[index]['SelectedChecks'].length; check++) {
        switch (this.deviceList[index]['SelectedChecks'][check]) {
          case 'OCR Check':
            let ocrValue;
            ocrValue = await this.http.post(environment.nodeApi + '/scan-ocr', { imageName: this.imageName }).toPromise();
            this.measurementCheck = this.validateOCRCheck(ocrValue, this.selectedDeviceName, this.deviceList[index]['SelectedChecks'][check], index)
            this.scannedResult[0].selectedChecks.push({ 'checkName': this.deviceList[index]['SelectedChecks'][check], 'checkValue': this.measurementCheck })
            break;
          case 'Measurement Check':
            let measurementValue;
            measurementValue = await this.http.post(environment.nodeApi + '/measurement-check', { imageName: this.imageName }).toPromise();
            this.measurementCheck = this.validateMeasurementCheck(measurementValue, this.selectedDeviceName, this.deviceList[index]['SelectedChecks'][check], index)
            this.scannedResult[0].selectedChecks.push({ 'checkName': this.deviceList[index]['SelectedChecks'][check], 'checkValue': this.measurementCheck })
            break;
          case 'Color Check':
            let colorValue;
            colorValue = await this.http.post(environment.nodeApi + '/color-check', { imageName: this.imageName }).toPromise();
            this.measurementCheck = this.validateColorCheck(colorValue, this.selectedDeviceName, this.deviceList[index]['SelectedChecks'][check], index)
            this.scannedResult[0].selectedChecks.push({ 'checkName': this.deviceList[index]['SelectedChecks'][check], 'checkValue': this.measurementCheck })
            break;
        }
      }
      this.isScanComplete = true;
    }
    else {
      this.service.showMessage('Please choose all the input field names')
    }

  }
  validateOCRCheck(characters, deviceName, check, index) {
    let ocrCheck;
    if (characters === this.deviceValueList['dataset'][index][deviceName][check]['Characters'])
      ocrCheck = 'passed'
    else
      ocrCheck = 'failed'
    this.scannedResultValues[deviceName][check] = { 'Characters': characters }
    return ocrCheck;
  }
  validateMeasurementCheck(measures, deviceName, check, index) {
    let measurementCheck;
    for (let i = 0; i < measures.toString().split('-').length; i++) {
      this.sizeOfProduct[measures.toString().split('-')[i].split(':')[0].trim()] = parseFloat(measures.toString().split('-')[i].split(':')[1]).toFixed(1);
    }
    if (this.sizeOfProduct['Height'] === this.deviceValueList['dataset'][index][deviceName][check]['Height'] &&
      this.sizeOfProduct['Width'] === this.deviceValueList['dataset'][index][deviceName][check]['Width'])
      measurementCheck = 'passed'
    else
      measurementCheck = 'failed'
    this.scannedResultValues[deviceName][check] = {
      'Height': this.sizeOfProduct['Height'],
      'Width': this.sizeOfProduct['Width']
    }
    return measurementCheck;
  }
  validateColorCheck(colors, deviceName, check, deviceIndex) {
    let colorCheck;
    let color;
    for (let i = 0; i < colors.length; i++) {
      if (colors[i] === this.deviceValueList['dataset'][deviceIndex][deviceName][check]['Color']) {
        color = colors[i]
        colorCheck = 'passed'
        break;
      }
      else {
        color = colors[i]
        colorCheck = 'failed'
      }
    }
    this.scannedResultValues[deviceName][check] = { 'Color': color }
    return colorCheck;
  }
  async getDeviceValues() {
    this.deviceValueList = await this.http.get(environment.nodeApi + '/get-value-lists').toPromise();
  }
  openValueForCheck(deviceName, checkName) {
    this.tableDeviceValue.dataset = [];
    this.tableDeviceValue.columns = [];
    let pushedArray = []
    let valueObject = {}
    const deviceArray = this.deviceValueList['dataset'];
    for (let index = 0; index < deviceArray.length; index++) {
      if (Object.keys(deviceArray[index])[0] === deviceName) {
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
  openValueForScannedResult(deviceName, checkName) {
    this.tableDeviceValueScanned.dataset = [];
    this.tableDeviceValueScanned.columns = [];
    let pushedArray = []
    let valueObject = {}
    const deviceArray = [this.scannedResultValues];
    for (let index = 0; index < deviceArray.length; index++) {
      if (Object.keys(deviceArray[index])[0] === deviceName) {
        this.tableDeviceValueScanned.columns = Object.keys(deviceArray[index][deviceName][checkName]);
        valueObject = deviceArray[index][deviceName][checkName]
      }
    }
    for (const key in valueObject) {
      pushedArray.push([valueObject[key]])
    }
    if ([pushedArray][0].length > 1)
      this.tableDeviceValueScanned.dataset = [Array.prototype.concat.apply([], pushedArray)];
    else
      this.tableDeviceValueScanned.dataset = pushedArray
  }
}

