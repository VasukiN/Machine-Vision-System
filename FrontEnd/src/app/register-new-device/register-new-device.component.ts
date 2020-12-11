import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as checkList from '../check-list.json';
import { FormBuilder, FormGroup, FormArray, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register-new-device',
  templateUrl: './register-new-device.component.html',
  styleUrls: ['./register-new-device.component.css']
})

export class RegisterNewDeviceComponent implements OnInit {
  allChecksForDropDown: Array<string>;
  checksControl = new FormControl();
  checkForm: FormGroup;
  @Output() registerDeviceClicked = new EventEmitter<any>();
  formArray: AbstractControl[];
  label: string;
  selectedCheck = [];
  dynamicLabelsList = {
    "OCR Check": { "Characters": "character" },
    "Measurement Check": { "Height": "height", "Width": "width", "Unit": "Cm" },
    "Color Check": { "Color": "color" }
  }

  constructor(private fb: FormBuilder) {
    this.checkForm = this.fb.group({
      deviceName: this.fb.array([this.fb.control('')]),
      "OCR Check": this.fb.array([]),
      "Measurement Check": this.fb.array([]),
      "Color Check": this.fb.array([])
    }
    )
  }
  ngOnInit() {
    this.allChecksForDropDown = this.getAllCheckListForDropDown(checkList.checks)
  }
  getAllCheckListForDropDown(checklist) {
    let checkArray; let allChecks = [];
    checkArray = checklist;
    for (let index = 0; index < checkArray.length; index++) {
      let checks = checkArray[index]['CheckName'];
      allChecks.push(checks)
    }
    return allChecks;
  }
  selectChecks(checks) {
    this.selectedCheck.push(checks)
    for (const key in this.dynamicLabelsList) {
      if (checks === key) {
        for (const key2 in this.dynamicLabelsList[key]) {
          (this.checkForm.get(key) as FormArray).push(this.fb.control(''));
          this.label = this.dynamicLabelsList[key][key2]
        }
      }
    }
  }
  registerNewDevice() {
    let valueObject = {};
    let deviceValueObject = {};
    let deviceName = this.checkForm.controls['deviceName'].value[0]
    for (let index = 0; index < this.selectedCheck.length; index++) {
      let check = this.selectedCheck[index];
      valueObject[check] = {}
      let keyIndex = 0;
      for (const key in this.dynamicLabelsList[this.selectedCheck[index]]) {
        if (key === 'Unit')
          valueObject[check][key] = 'Cm'
        else
          valueObject[check][key] = this.checkForm.controls[this.selectedCheck[index]].value[keyIndex]
        keyIndex = keyIndex + 1;
      }
    }
    deviceValueObject[deviceName] = valueObject;
    this.registerDeviceClicked.emit([{
      "DeviceName": this.checkForm.controls['deviceName'].value[0]
      , "SelectedChecks": this.selectedCheck
    }, deviceValueObject]);
  }
}
