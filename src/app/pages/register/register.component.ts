import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DataService } from "app/shared/http/data.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private dataService: DataService) {}

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

  switchToLogin() {}
}
