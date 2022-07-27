import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error = "";

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }
    this.isLoading = true;

    if (this.isLoginMode) {
      return;
    } else {
      const email = authForm.value.email;
      const password = authForm.value.password;
      this.authService.signUp(email, password).subscribe(
        (responseData) => {
          console.log(responseData);
          this.isLoading = !this.isLoading;
        },
        (errorResp) => {
          this.isLoading = !this.isLoading;
          this.error = "An Error Occured";
        }
      );
    }

    authForm.reset();
  }
}
