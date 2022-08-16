import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "app/shared/auth/auth.service";
import { DataService } from "app/shared/http/data.service";
import Swal from "sweetalert2";
import {ErrorPopupService} from '../../shared/error-popup/error-popup.service';
import {LOCALHOST_USERS} from '../../shared/config/user-constants/user-constants.constans';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService,
    private errorPopupService: ErrorPopupService
  ) {}

  ngOnInit(): void {
    if (this.authService.loggedIn) {
      this.router.navigate(["/adverts"]);
      return;
    }
    this.initForm();
  }

  onSubmit() {
    this.sendRegistrationRequest();
  }

  switchToLogin() {
    this.router.navigate(["/login"]);
  }
  private initForm() {
    this.registerForm = new FormGroup({
      firstname: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      isEmployer: new FormControl(false, Validators.required),
    });
  }
  private sendRegistrationRequest() {
    this.dataService
      .create<any>(
        this.registerForm.value,
        LOCALHOST_USERS + "/registration"
      )
      .subscribe(
        (response) => {
          Swal.fire({
            icon: "success",
            title: "Redirecting the login page.",
            text: "You can login from now.",
          }).then((resp) => {
            this.switchToLogin();
          });
        },
        (err) => {
          this.errorPopupService.alert(err.error.message);
        }
      );
  }
}
