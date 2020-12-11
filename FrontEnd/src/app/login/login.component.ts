import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../shared/common.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userName: string;
  password: string;
  isUserLoggedIn: boolean;
  isUserExist: boolean;
  message: string;
  constructor(private common: CommonService, private router: Router, private http: HttpClient) { }
  @Input() isUserLogOff: boolean;
  ngOnInit() {
  }
  async navigateToDashboard() {
    let userData = {};
    userData = await this.http.post(environment.nodeApi + '/login', { userId: this.userName, password: this.password }).toPromise();
    if (userData.hasOwnProperty('isUserExist') && userData['isUserExist'] === false) {
      this.isUserExist = userData['isUserExist'];
      this.message = "Invalid username and password";
      this.common.showMessage(this.message)
    }
    else {
      this.common.changeDownloadReportLinkOption(true)
      this.router.navigate(['/home'])
    }
  }

}
