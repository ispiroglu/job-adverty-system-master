import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationPopupService } from "app/shared/confirmation-popup/confirmation-popup.service";
import { LocationService } from "app/shared/locationJson/location-json.service";
import { PdfViewerComponent } from "ng2-pdf-viewer";
import { UserModal } from "../adverts/advert/advert-modal/advert-modal.component";
import { User } from "./shared/model/user.model";

import { UserService } from "./user.service";
import {DataService} from '../../shared/http/data.service';
import {resourceChangeTicket} from '@angular/compiler-cli/src/ngtsc/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  // tslint:disable-next-line:component-selector
  selector: "user-cmp",
  moduleId: module.id,
  templateUrl: "user.component.html",
  styleUrls: ["user.component.scss"],
  styles: [
    `
      .modal-backdrop.modal-index {
        z-index: 1031 !important;
      }
    `,
  ],
})
export class UserComponent implements OnInit {
  @ViewChild(PdfViewerComponent, { static: false })
  private pdfComponent: PdfViewerComponent;
  editMode = true;
  userID: number;
  pdfSrc: string;
  photoSrc: string;
  user: User;
  @Input() inModal;
  userForm: FormGroup;
  constructor(
    private userService: UserService,
    private locationService: LocationService,
    private confirmationPopupService: ConfirmationPopupService,
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {
  }
  ngOnInit() {
    this.initForm();
    if (this.inModal) {
      this.userID = this.inModal.id
      this.userForm.disable();
    } else {
      this.userID = 2;
    }
    this.dataService.get<Blob>(`http://localhost:8080/api/v1/users/${this.userID}/photo`)
      .subscribe((response) => {
        this.photoSrc = 'data:image/jpeg;base64,' + JSON.parse(JSON.stringify(response.body));
        this.sanitizer.bypassSecurityTrustUrl(this.photoSrc);
      })
    this.dataService.get<Blob>(`http://localhost:8080/api/v1/users/${this.userID}/cv`)
      .subscribe((response) => {
        this.pdfSrc = 'data:image/jpeg;base64,' + JSON.parse(JSON.stringify(response.body));
        this.sanitizer.bypassSecurityTrustUrl(this.pdfSrc);
      })
    this.dataService.get<User>(`http://localhost:8080/api/v1/users/${this.userID}`)
      .subscribe( (response) => {
        this.user = response.body;
        this.patchForm();
      });
  }

  onClickSubmit() {
    this.confirmationPopupService.confirm(
      "Do you want to update your profile?",
      this.updateUser.bind(this)
    );
  }

  updateUser() {
    this.user = this.userForm.value;
    this.user.province = this.locationService.getProvinces()[this.user.provinceID].il;
    this.dataService.update<User>(this.user, `http://localhost:8080/api/v1/users/${this.userID}`)
      .subscribe((response) => {
        console.log(response)
      })
  }

  isFormValid() {
    return this.userForm.valid;
  }

  pageRendered() {
    this.pdfComponent.pdfViewer.currentScaleValue = "page-fit";
  }

  initForm() {
    const firstname = "";
    const  lastname = "";
    const gender = "";
    const email = "";
    const phoneNumber = "";
    const district = "";
    const provinceID = 0;
    const experience = 0;
    const aboutUser = ""

    // this.user = this.userService.getUser(this.userID);

    this.userForm = new FormGroup({
      firstname: new FormControl(firstname, Validators.required),
      lastname: new FormControl(lastname, Validators.required),
      gender: new FormControl(gender.toLocaleLowerCase(), Validators.required),
      email: new FormControl(email, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(phoneNumber, Validators.required),
      provinceID: new FormControl(provinceID, Validators.required),
      district: new FormControl(district, Validators.required),
      experience: new FormControl(experience, Validators.required),
      aboutUser: new FormControl(aboutUser, Validators.required),
    });
  }
  patchForm() {
    this.userForm.patchValue({
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      gender: this.user.gender.toLocaleLowerCase(),
      email: this.user.email,
      phoneNumber: this.user.phoneNumber,
      provinceID: this.user.provinceID,
      district: this.user.district,
      experience: this.user.experience,
      aboutUser: this.user.aboutUser,
    });
  }
  onProvinceChange(data: any) {
    console.log(data);
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
