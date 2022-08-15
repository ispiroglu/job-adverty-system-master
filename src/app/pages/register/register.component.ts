import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "app/shared/auth.service";
import { DataService } from "app/shared/http/data.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  public foo = { id: 1, name: "evren" };

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.loggedIn) {
      this.router.navigate(["/adverts"]);
    }

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

  onSubmit() {
    console.log(this.registerForm.value);

    this.dataService
      .create<any>(
        this.registerForm.value,
        "http://localhost:8080/api/v1/users/registration"
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
        (err) => {}
      );
  }

  switchToLogin() {
    this.router.navigate(["/login"]);
  }
}
