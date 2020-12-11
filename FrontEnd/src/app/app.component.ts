import { Component } from '@angular/core';
import { CommonService } from './shared/common.service';
import { faSearchPlus, faReceipt, faPlusSquare,faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  faSearchPlus = faSearchPlus;
  faReceipt = faReceipt;
  faPlusSquare = faPlusSquare;
  faSignOutAlt = faSignOutAlt;
  isUserLoggedIn: boolean=false;
  isUserLogOff:boolean = false;
  constructor(private common: CommonService,private router:Router) {
    this.common.currentUserLoggedIn.subscribe(userLog => {
      this.isUserLoggedIn = userLog
    })
  }
  logout(){
    this.isUserLogOff=false;
    this.isUserLoggedIn=false;
    this.router.navigate(['/login'])
  }
  title = 'automated-vision-system';
}
