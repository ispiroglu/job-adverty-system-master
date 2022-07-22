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
  styles: [],
})
export class UserComponent implements OnInit {
  editMode = true;
  userID: number;
  @ViewChild("province", { static: false }) provinceList: ElementRef;
  @ViewChild("district", { static: false }) districtList: ElementRef;
  pdfSrc = "assets/json/EvrenIspiroglu_cv.pdf";

  user: User;
  @Input() inModal: boolean = false;

  selectedProvinceID: number;

  public page = 1;

  public pageLabel: string;

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

  onClickSubmit() {}

  initForm() {
    let firstname = "";
    let lastname = "";
    let gender = "";
    let email = "";
    let phoneNumber = "";
    let district = "";
    let provinceID: number;
    let experience: number = 0;
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
      province: new FormControl(provinceID, Validators.required),
      district: new FormControl(district, Validators.required),
      experience: new FormControl(experience, Validators.required),
      aboutUser: new FormControl(aboutUser, Validators.required),
    });
  }
  getProvinces() {
    return this.locationService.getProvinces();
  }
  getDistricts() {
    if (this.userForm.get("province").value) {
      return this.locationService.getProvinces()[
        this.userForm.get("province").value
      ].ilceleri;
    }
  }
}
