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
  forbiddenValue = "-1";
  @Input() inModal;
  userForm: FormGroup;

  photoUploadCredentials: {
    type: string;
    ID: number;
    requiredFileType: string;
    caption: string;
  };
  cvUploadCredentials: {
    type: string;
    ID: number;
    requiredFileType: string;
    caption: string;
  };
  @Output() sendRequestSubject = new Subject<number>();

  constructor(
    private locationService: LocationService,
    private confirmationPopupService: ConfirmationPopupService,
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.inModal) {
      this.userID = this.inModal.id;
      this.userForm.disable();
    } else {
      this.userID = 7;
    }
    this.dataService
      .get<Blob>(`http://localhost:8080/api/v1/users/${this.userID}/photo`)
      .subscribe((response) => {
        this.photoSrc =
          "data:image/jpeg;base64," + JSON.parse(JSON.stringify(response.body));
        this.sanitizer.bypassSecurityTrustUrl(this.photoSrc);
      });
    this.dataService
      .get<Blob>(`http://localhost:8080/api/v1/users/${this.userID}/cv`)
      .subscribe((response) => {
        this.pdfSrc =
          "data:image/jpeg;base64," + JSON.parse(JSON.stringify(response.body));
        this.sanitizer.bypassSecurityTrustUrl(this.pdfSrc);
      });
    this.dataService
      .get<User>(`http://localhost:8080/api/v1/users/${this.userID}`)
      .subscribe((response) => {
        this.user = response.body;
        console.log(this.user);
        this.patchForm();
      });

    this.photoUploadCredentials = {
      type: "user",
      ID: this.userID,
      requiredFileType: "image/png, ,image/jpeg",
      caption: "photo",
    };
    this.cvUploadCredentials = {
      type: "user",
      ID: this.userID,
      requiredFileType: "application/pdf",
      caption: "cv",
    };
  }

  onClickSubmit() {
    this.userForm.patchValue({
      province:
        this.locationService.getProvinces()[
          this.userForm.get("provinceID").value
        ].il,
    });
    this.confirmationPopupService.confirm(
      "Do you want to update your profile?",
      this.updateUser.bind(this)
    );
  }

  updateUser() {
    this.sendRequestSubject.next(this.userID);
    this.user = this.userForm.value;
    this.user.province =
      this.locationService.getProvinces()[this.user.provinceID].il;
    this.dataService
      .update<User>(
        this.user,
        `http://localhost:8080/api/v1/users/${this.userID}`
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  isFormValid() {
    return this.userForm.valid;
  }

  pageRendered() {
    this.pdfComponent.pdfViewer.currentScaleValue = "page-fit";
  }

  initForm() {
    const firstname = "";
    const lastname = "";
    const gender = "";
    const email = "";
    const phoneNumber = "";
    const district = "";
    const provinceID = "-1";
    const experience = 0;
    const aboutUser = "";

    this.userForm = new FormGroup({
      firstname: new FormControl(firstname, Validators.required),
      lastname: new FormControl(lastname, Validators.required),
      gender: new FormControl(gender.toLocaleLowerCase(), Validators.required),
      email: new FormControl(email, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(phoneNumber, Validators.required),
      provinceID: new FormControl(provinceID, [
        Validators.required,
        (control: AbstractControl) => {
          return this.forbiddenValue.indexOf(control.value) === -1
            ? null
            : { forbiddenValue: true };
        },
      ]),
      district: new FormControl(district, [
        Validators.required,
        (control: AbstractControl) => {
          return this.forbiddenValue.indexOf(control.value) === -1
            ? null
            : { forbiddenValue: true };
        },
      ]),
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

  cachedFile(event: { url: string; type: string }) {
    console.log(event);

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
}
