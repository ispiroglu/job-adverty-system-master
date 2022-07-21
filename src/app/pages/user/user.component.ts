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
})
export class UserComponent implements OnInit, AfterContentInit {
  editMode = true;
  userID: number;
  @ViewChild("province", { static: false }) provinceList: ElementRef;
  @ViewChild("district", { static: false }) districtList: ElementRef;
  pdfSrc = "src/app/pages/user/EvrenIspiroglu_cv.pdf";
  user: User;
  @Input() inModal: boolean = false;
  selectedProvinceID: number;

  // pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
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
    console.log(this.userForm.value);
  }
  ngAfterContentInit() {
    this.userForm.patchValue({ province: "Ankara" });
    console.log("----------------------------------");
    console.log(this.userForm.value);
    console.log("----------------------------------");
  }

  onClickSubmit() {}

  initForm() {
    let firstname = "";
    let lastname = "";
    let gender = "";
    let email = "";
    let phoneNumber = "";
    let district = "";
    let province = "";
    let experience: number = 0;
    let aboutUser = "";

    this.user = this.userService.getUser(this.userID);

    if (this.user) {
      firstname = this.user.firstname;
      lastname = this.user.lastname;
      gender = this.user.gender;
      email = this.user.email;
      phoneNumber = this.user.phoneNumber;
      province = this.user.province;
      district = this.user.district;
      experience = this.user.experience;
      aboutUser = this.user.aboutUser;
    }

    this.userForm = new FormGroup({
      firstname: new FormControl(firstname, Validators.required),
      lastname: new FormControl(lastname, Validators.required),
      gender: new FormControl(gender, Validators.required),
      email: new FormControl(email, Validators.required),
      phoneNumber: new FormControl(phoneNumber, Validators.required),
      province: new FormControl(province, Validators.required),
      district: new FormControl(district, Validators.required),
      experience: new FormControl(experience, Validators.required),
      aboutUser: new FormControl(aboutUser, Validators.required),
    });

    console.log(this.userForm.get("province").value);
  }
  getProvinces() {
    return this.locationService.getProvinces();
  }
  getDistricts() {
    if (this.selectedProvinceID) {
      return this.locationService.getProvinces()[this.selectedProvinceID - 1]
        .ilceleri;
    }
  }
}
