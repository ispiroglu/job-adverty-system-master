import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/auth/auth.service";

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
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });

    this.isLoggedIn = this.authService.checkCredentials();
    const code = this.activeRoute.snapshot.queryParamMap.get("code");
    console.log(this.activeRoute.snapshot.queryParamMap);

    console.log(code);

    if (!this.isLoggedIn && code) {
      this.authService.retrieveToken(code);
    }
  }

  login() {
    window.location.href =
      "http://localhost:8090/realms/dev/protocol/openid-connect/auth?response_type=code&client_id=advert-service&scope=openid&redirect_uri=" +
      "http://localhost:4200/login";
  }

  onSubmit() {
    console.log(this.loginForm.value);
  }
  switchToRegister() {
    this.router.navigate(["/register"]);
  }
}
