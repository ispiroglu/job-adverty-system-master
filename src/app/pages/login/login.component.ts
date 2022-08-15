import { HttpHeaders, HttpParams, HttpStatusCode } from "@angular/common/http";
import { Component, OnChanges, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "app/shared/auth.service";
import { ErrorPopupService } from "app/shared/error-popup/error-popup.service";
import { DataService } from "app/shared/http/data.service";
import jwtDecode from "jwt-decode";
import { User } from "../user/shared/model/user.model";
import { UserLoginModel } from "./model/user-login.model";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  public isLoggedIn = false;

  constructor(
    private router: Router,
    private dataService: DataService,
    private authService: AuthService,
    private errorService: ErrorPopupService
  ) {}

  ngOnInit(): void {
    if (this.authService.loggedIn) {
      this.router.navigate(["/adverts"]);
      return;
    }
    this.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  onSubmit() {
    this.dataService
      .get<any>("http://localhost:8080/api/v1/login", this.loginForm.value)
      .subscribe(
        (response) => {
          localStorage.setItem("access_token", response.body.access_token);
          localStorage.setItem("refresh_token", response.body.refresh_token);
          let decodedToken: any = jwtDecode(response.body.access_token);
          console.log(decodedToken);

          const email = decodedToken.sub;
          this.dataService
            .get<any>(`http://localhost:8080/api/v1/users/login/${email}`, null)
            .subscribe(
              (response) => {
                console.log(response);

                this.authService.userInit.next({
                  id: response.body.id,
                  isEmployer: response.body.employer,
                  ownedAdvertIds: response.body.ownedAdvertIDs,
                });

                this.router.navigate(["/adverts"]);
              },
              (error) => {
                this.errorService.alert(error.error.message);
              }
            );
        },
        (error) => {
          if (error.status === HttpStatusCode.Forbidden) {
            this.errorService.alert("Wrong crededentials!");
          } else {
            this.errorService.alert("Please try again");
          }
        }
      );
  }
  switchToRegister() {
    this.router.navigate(["/register"]);
  }
}
