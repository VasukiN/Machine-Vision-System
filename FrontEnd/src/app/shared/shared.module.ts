import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from './common.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [CommonService],
})
export class SharedModule { }
