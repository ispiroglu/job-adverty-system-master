import { Component, Input, OnInit, Output, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ConfirmationPopupService } from "app/shared/confirmation-popup/confirmation-popup.service";
import { LocationService } from "app/shared/locationJson/location-json.service";
import { PdfViewerComponent } from "ng2-pdf-viewer";
import { User } from "./shared/model/user.model";
import { DataService } from "../../shared/http/data.service";
import { DomSanitizer } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { AuthService } from "app/shared/auth/auth.service";
import {FileCredentialsModel} from '../../shared/file-upload/model/file-credentials.model';
import {LOCALHOST_USERS} from '../../shared/config/user-constants/user-constants.constans';

@Component({
  selector: "app-user",
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
  @Input() inModal;

  userID: number;
  pdfSrc: string;
  photoSrc: string;
  user: User;
  forbiddenValue = "-1";
  userForm: FormGroup;

  photoUploadCredentials: FileCredentialsModel;
  cvUploadCredentials: FileCredentialsModel;

  @Output() sendCvSubject = new Subject<number>();
  @Output() sendPhotoSubject = new Subject<number>();

  constructor(
    private locationService: LocationService,
    private confirmationPopupService: ConfirmationPopupService,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.inModal) {
      this.userID = this.inModal.id;
      this.userForm.disable();
    } else {
      this.authService.employerControllerHandler.subscribe(() => {
        this.userID = this.authService.userId;
      });
    }
    this.getUserDetails();
    this.getUserPhoto();
    this.getUserCv();
    this.photoUploadCredentials = new FileCredentialsModel("user", this.userID, "image/png, ,image/jpeg", "photo")
    this.cvUploadCredentials = new FileCredentialsModel("user", this.userID, "application/pdf", "cv")
  }

  onClickSubmit() {
    this.correctProvinceID(),
    this.confirmationPopupService.confirm(
      "Do you want to update your profile?",
      this.updateUser.bind(this)
    );
  }

  updateUser() {
    this.user = this.userForm.value;
    this.user.province =
      this.locationService.getProvinces()[this.user.provinceID].il;
    this.dataService
      .update<User>(
        this.user,
        `http://localhost:8080/api/v1/users/${this.userID}`
      )
      .subscribe((response) => {
        this.sendCvSubject.next(this.userID);
        setTimeout(() => {
          this.sendPhotoSubject.next(this.userID);
        }, 500);
      });
  }

  isFormValid() {
    return this.userForm.valid;
  }

  pageRendered() {
    this.pdfComponent.pdfViewer.currentScaleValue = "page-fit";
  }

  cachedFile(event: { url: string; type: string }) {
    this.sanitizer.bypassSecurityTrustUrl(event.url);
    switch (event.type) {
      case "photo":
        this.photoSrc = event.url;
        break;
      case "cv":
        this.pdfSrc = event.url;
        break;
    }
  }

  onProvinceChange() {
    this.userForm.patchValue({ district: "-1" });
  }

  getProvinces() {
    return this.locationService.getProvinces();
  }

  getDistricts() {
    if (this.userForm.get("provinceID").value > -1) {
      return this.locationService.getProvinces()[
        this.userForm.get("provinceID").value
      ].ilceleri;
    }
  }
  private initForm() {
    this.userForm = new FormGroup({
      firstname: new FormControl(null, Validators.required),
      lastname: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      provinceID: new FormControl(null, [
        Validators.required,
        (control: AbstractControl) => {
          return this.forbiddenValue.indexOf(control.value) === -1
            ? null
            : { forbiddenValue: true };
        },
      ]),
      district: new FormControl(null, [
        Validators.required,
        (control: AbstractControl) => {
          return this.forbiddenValue.indexOf(control.value) === -1
            ? null
            : { forbiddenValue: true };
        },
      ]),
      experience: new FormControl(null, [
        Validators.required,
        Validators.min(0),
      ]),
      aboutUser: new FormControl(null, Validators.required),
    });
  }

  private getUserDetails() {
    this.dataService
      .get<User>(LOCALHOST_USERS + `/${this.userID}`)
      .subscribe((response) => {
        this.user = response.body;
        this.patchForm();
      });
  }
  private getUserPhoto() {
    this.dataService
      .get<Blob>(LOCALHOST_USERS + `/${this.userID}/photo`)
      .subscribe((response) => {
        this.photoSrc =
          "data:image/jpeg;base64," + JSON.parse(JSON.stringify(response.body));
        this.sanitizer.bypassSecurityTrustUrl(this.photoSrc);
      });
  }

  private getUserCv() {
    this.dataService
      .get<Blob>(LOCALHOST_USERS + `/${this.userID}/cv`)
      .subscribe((response) => {
        this.pdfSrc =
          "data:image/jpeg;base64," + JSON.parse(JSON.stringify(response.body));
        this.sanitizer.bypassSecurityTrustUrl(this.pdfSrc);
      });
  }

  private patchForm() {
    this.userForm.patchValue({
      firstname: this.user.firstname ? this.user.firstname : "",
      lastname: this.user.lastname ? this.user.lastname : "",
      gender: this.user.gender ? this.user.gender.toLocaleLowerCase() : "male",
      email: this.user.email ? this.user.email : "",
      phoneNumber: this.user.phoneNumber ? this.user.phoneNumber : "",
      provinceID: this.user.provinceID ? this.user.provinceID : -1,
      district: this.user.district ? this.user.district : "-1",
      experience: this.user.experience ? this.user.experience : 0,
      aboutUser: this.user.aboutUser ? this.user.aboutUser : "",
    });
  }

  private correctProvinceID() {
    this.userForm.patchValue({
      province:
      this.locationService.getProvinces()[
        this.userForm.get("provinceID").value
        ].il,
    });
  }
}
