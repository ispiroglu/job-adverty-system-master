import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "app/auth/auth.service";
import { DataService } from "app/shared/http/data.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  public foo = { id: 1, name: "evren" };
  private foosUrl = "http://localhost:8081/resource-server/api/foos/";

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
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
        "http://localhost:8080/api/v1/users"
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  switchToLogin() {
    this.router.navigate(["/login"]);
  }

  getFoo() {
    this.authService.getResource(this.foosUrl + this.foo.id).subscribe(
      (data) => (this.foo = data),
      (error) => (this.foo.name = "Error")
    );
  }
}
