import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  adminHasChanged = new Subject<boolean>();
  loggedIn = true;
  constructor() {}

  toggleLoggedIn() {
    this.loggedIn = !this.loggedIn;
    this.adminHasChanged.next(this.loggedIn);
  }
}
