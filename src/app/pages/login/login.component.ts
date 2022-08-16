import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "app/shared/auth/auth.service";
import { ErrorPopupService } from "app/shared/error-popup/error-popup.service";

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
    if (this.loginForm.invalid) {
      this.errorService.alert("Please fill the blanks correctly!");
      return;
    }
    this.sendLoginRequest();
  }

  private sendLoginRequest() {
    this.authService.login(
      { email: this.loginForm.get('email').value,
                      password: this.loginForm.get('password').value});
  }

  switchToRegister() {
    this.router.navigate(["/register"]);
  }
}
