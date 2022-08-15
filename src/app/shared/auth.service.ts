import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import jwtDecode from "jwt-decode";
import { BehaviorSubject, Subject } from "rxjs";
import { DataService } from "./http/data.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private tokenExpirationTimer: any;
  adminHasChanged = new BehaviorSubject<boolean>(false);
  isEmployer: boolean;
  userId: number;
  userInit = new Subject<{
    id: number;
    isEmployer: boolean;
    ownedAdvertIds: number[];
  }>();
  bearerToken: string;
  loggedIn = false;
  ownedAdvertIDs: number[] = [];
  constructor(private dataService: DataService, private router: Router) {
    this.userInit.subscribe((model) => {
      this.userId = model.id;
      this.isEmployer = model.isEmployer;
      this.ownedAdvertIDs = model.ownedAdvertIds;
      console.log(this.ownedAdvertIDs);
      this.adminHasChanged.next(this.isEmployer);
      this.loggedIn = true;
    });
  }
  logout() {
    this.userId = null;
    this.adminHasChanged.next(null);
    this.isEmployer = null;
    this.loggedIn = false;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const token: any = jwtDecode(localStorage.getItem("access_token"));
    if (!token || new Date() > new Date(token.exp * 1000)) {
      return;
    }
    this.autoLogout(
      new Date(token.exp * 1000).getTime() - new Date().getTime()
    );
    this.loggedIn = true;
    const email = token.sub;
    this.dataService
      .get<any>(`http://localhost:8080/api/v1/users/login/${email}`, null)
      .subscribe((response) => {
        this.userId = response.body.id;
        this.isEmployer = response.body.employer;
        this.adminHasChanged.next(this.isEmployer);
        this.ownedAdvertIDs = response.body.ownedAdvertIDs;
      });
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this.router.navigate(["/login"]);
    }, expirationDuration);
  }
}
