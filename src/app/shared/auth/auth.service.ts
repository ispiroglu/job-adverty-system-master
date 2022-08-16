import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import jwtDecode from "jwt-decode";
import { BehaviorSubject, Subject } from "rxjs";
import { DataService } from "../http/data.service";
import {LoginCredentialsModel} from './model/login-credentials.model';
import { ACCESS_TOKEN, LOCALHOST_LOGIN_URL, REFRESH_TOKEN } from '../config/auth-constants/auth-constants.constants';
import {HttpParams, HttpStatusCode} from '@angular/common/http';
import { LOCALHOST_USERS } from '../config/user-constants/user-constants.constans';
import {ErrorPopupService} from '../error-popup/error-popup.service';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  employerControllerHandler = new BehaviorSubject<boolean>(false);
  isEmployer: boolean;
  userId: number;
  loggedIn = false;
  ownedAdvertIDs: number[] = [];
  private tokenExpirationTimer: any;

  constructor(private dataService: DataService, private router: Router, private errorPopupService: ErrorPopupService) {}

  login(loginCredentials: LoginCredentialsModel) {
    let loginParams = new HttpParams();
    loginParams = loginParams.append("email", loginCredentials.email);
    loginParams = loginParams.append("password", loginCredentials.password);
    this.dataService.get<any>(LOCALHOST_LOGIN_URL, loginParams)
      .subscribe(
        (response) => {
          this.setTokensToLocalStorage(response.body);
          this.getUserAttributes(loginCredentials.email);

        }, (error) => {
          if (error.status === HttpStatusCode.Forbidden) {
            this.errorPopupService.alert("Invalid email or password");
          } else {
            this.errorPopupService.alert("Please try again");
          }
        }
      )
  }

  logout() {
    this.userId = null;
    this.employerControllerHandler.next(null);
    this.isEmployer = null;
    this.loggedIn = false;
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(["/login"]);
  }

  autoLogin() {
    const decodedToken: any = jwtDecode(localStorage.getItem(ACCESS_TOKEN));
    if (!decodedToken || new Date() > new Date(decodedToken.exp * 1000)) {
      return;
    }
    this.autoLogout(
      new Date(decodedToken.exp * 1000).getTime() - new Date().getTime()
    );
    this.getUserAttributes(decodedToken.sub);
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private setTokensToLocalStorage(responseBody: any) {
    localStorage.setItem(ACCESS_TOKEN, responseBody.access_token);
    localStorage.setItem(REFRESH_TOKEN, responseBody.refresh_token);
    const decodedToken: any  = jwtDecode(responseBody.access_token);
    this.autoLogout(new Date(decodedToken.exp * 1000).getTime())
  }

  private getUserAttributes(email: string) {
    this.dataService
      .get<any>(LOCALHOST_USERS + `/login/${email}`)
      .subscribe(
        (response) => {
          this.bindResponseToUserAttributes(response.body);
          this.employerControllerHandler.next(this.isEmployer);
          this.loggedIn = true;
          this.router.navigate(["/adverts"]);
        },
        (error) => {
          this.errorPopupService.alert(error.error.message);
        }
      );
  }

  private bindResponseToUserAttributes(responseBody: any) {
    this.userId = responseBody.id;
    this.isEmployer = responseBody.employer;
    this.ownedAdvertIDs = responseBody.ownedAdvertIDs;
  }
}
