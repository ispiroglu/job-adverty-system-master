import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { LocationService } from "app/shared/locationJson/location-json.service";
import { User } from "./user.model";

import { UserService } from "./user.service";

@Component({
  selector: "user-cmp",
  moduleId: module.id,
  templateUrl: "user.component.html",
  styleUrls: ["user.component.scss"]
})
export class UserComponent implements OnInit {
  editMode = true;
  userID: number;
  pdfSrc = "assets/json/EvrenIspiroglu_cv.pdf";
  user: User;
  @Input() inModal = false;
  userForm: FormGroup;
  constructor(
    private userService: UserService,
    private locationService: LocationService
  ) {
    this.userID = 1;
  }
  ngOnInit() {
    this.initForm();
    if (this.inModal) {
      this.userForm.disable();
    }
  }

  onClickSubmit() {
    if (confirm("Are you sure about updating your profile?")) {
      this.userService.updateUser(this.userForm.value, this.userID)
      this.user = this.userForm.value;
    }
  }

  isFormValid() {
    return this.userForm.valid;
  }

  initForm() {
    let firstname = "";
    let lastname = "";
    let gender = "";
    let email = "";
    let phoneNumber = "";
    let district = "";
    let provinceID: number;
    let experience: number;
    let aboutUser = "";

    this.user = this.userService.getUser(this.userID);

    if (this.user) {
      firstname = this.user.firstname;
      lastname = this.user.lastname;
      gender = this.user.gender;
      email = this.user.email;
      phoneNumber = this.user.phoneNumber;
      provinceID = this.user.provinceID;
      district = this.user.district;
      experience = this.user.experience;
      aboutUser = this.user.aboutUser;
    }

    this.userForm = new FormGroup({
      firstname: new FormControl(firstname, Validators.required),
      lastname: new FormControl(lastname, Validators.required),
      gender: new FormControl(gender.toLocaleLowerCase(), Validators.required),
      email: new FormControl(email, Validators.required),
      phoneNumber: new FormControl(phoneNumber, Validators.required),
      provinceID: new FormControl(provinceID, Validators.required),
      district: new FormControl(district, Validators.required),
      experience: new FormControl(experience, Validators.required),
      aboutUser: new FormControl(aboutUser, Validators.required),
    });
  }
  onProvinceChange(data: any) {
    console.log(data)
  }
  getProvinces() {
    return this.locationService.getProvinces();
  }
  getDistricts() {
    if (this.userForm.get("provinceID").value) {
      return this.locationService.getProvinces()[
        this.userForm.get("provinceID").value
      ].ilceleri;
    }
  }
}
