import { formatDate } from "@angular/common";
import {
  Component,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AuthService } from "app/shared/auth/auth.service";
import { ConfirmationPopupService } from "app/shared/confirmation-popup/confirmation-popup.service";
import { DataService } from "app/shared/http/data.service";
import { LocationService } from "app/shared/locationJson/location-json.service";
import { Subject } from "rxjs";
import { AdvertInfo } from "../shared/models/advert-info.model";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpParams } from "@angular/common/http";
import { ErrorPopupService } from "app/shared/error-popup/error-popup.service";
import {
  ADVERT_APPLY_CONFIRMATION_MESSAGE,
  ADVERT_CREATE_APPLY_CONFIRMATION_MESSAGE, ADVERT_EDIT_CONFIRMATION_MESSAGE,
  LOCALHOST_ADVERTS
} from '../../../shared/config/advert-constants/advert-constants.constants';
import {USER_ID} from '../../../shared/config/user-constants/user-constants.constans';

@Component({
  selector: "app-advert",
  templateUrl: "./advert.component.html",
  styleUrls: ["./advert.component.scss"],
})
export class AdvertComponent implements OnInit {
  advert: AdvertInfo;
  currentUserID: number;
  forbiddenValue = "forb";
  photoUrl = "";
  advertForm: FormGroup;
  createMode = false;
  isAdmin = false;
  advertID: number;
  jobDefinition: string;
  maxLength = 1000;
  photoUploadCredentials: {
    type: string;
    ID: number;
    requiredFileType: string;
    caption: string;
  };
  today = new Date();
  @Output() sendPhotoHandler = new Subject<number>();
  quillEditorStyle = {
    height: "300px",
    backgroundColor: "#ffff",
  };
  quillModules = {
    toolbar: {}
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private locationService: LocationService,
    private confirmationService: ConfirmationPopupService,
    private errorPopupService: ErrorPopupService,
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.authService.employerControllerHandler.subscribe(
      () => {
        this.isAdmin = this.authService.isEmployer;
        this.currentUserID = this.authService.userId;
      }
    );
    this.route.params.subscribe((params: Params) => {
      this.advertID = +params["id"];
      this.createMode = params["id"] === undefined;
    });

    this.initForm();

    if (!this.createMode) {
      this.getAdvertDetails();
    }
    this.setUploadCredentials();
  }

  isFormValid() {
    return this.advertForm.valid && this.photoUrl;
  }

  onSubmit() {
    const confirmText = !this.isAdmin
      ? ADVERT_APPLY_CONFIRMATION_MESSAGE
      : this.createMode
      ? ADVERT_CREATE_APPLY_CONFIRMATION_MESSAGE
      : ADVERT_EDIT_CONFIRMATION_MESSAGE
    this.confirmationService.confirm(confirmText, () => {
      this.correctProvinceID();
      if (!this.isAdmin) {
        this.applyForAdvert();
      } else {
        this.formToAdvert();
        if (this.createMode) {
          this.createAdvert();
        } else {
          this.editAdvert();
        }
      }
      // TODO : Should wait for create/edit response.
      setTimeout(() => {
        this.router.navigate(["../"], { relativeTo: this.route });
      }, 200);
    });
  }

  onClickCancel() {
    this.confirmationService.confirm("Are you really going to cancel?", () => {
      this.router.navigate(["../"], { relativeTo: this.route });
    });
  }
  // TODO: How to wait for response of subscription.
  onClickDelete() {
    this.dataService
      .get<boolean>(
        LOCALHOST_ADVERTS + `/${this.advertID}/applications/closable`
      )
      .subscribe((response) => {
        const canClose = response.body;
        if (canClose) {
          this.confirmationService.confirm(
            "Are you sure to delete this advert?",
            () => {
              this.dataService
                .delete<any>(
                  LOCALHOST_ADVERTS + `/${this.advertID}`
                )
                .subscribe((httpResponse) => {});
              setTimeout(() => {
                this.router.navigate(["../"], { relativeTo: this.route });
              }, 200);
            }
          );
        } else {
          this.errorPopupService.alert(
            "In order to delete this advert, you need to decide all the applications."
          );
        }
      });
  }
  onContentChanged(event) {
    if (event.editor.getLength() > this.maxLength) {
      event.editor.deleteText(this.maxLength, event.editor.getLength());
    }
  }

  patchForm() {
    this.advertForm.patchValue({
      name: this.advert.name,
      summary: this.advert.summary,
      position: this.advert.position,
      capacity: this.advert.capacity,
      companyName: this.advert.companyName,
      department: this.advert.department,
      startDate: formatDate(this.advert.startDate, "yyyy-MM-dd", "en"),
      endDate: formatDate(this.advert.endDate, "yyyy-MM-dd", "en"),
      provinceID: this.advert.provinceID,
      province: this.advert.province,
      district: this.advert.district,
      jobDefinition: this.advert.jobDefinition,
    });
  }

  isQuillEditorEmpty() {
    return this.advertForm.get("jobDefinition").value === null;
  }
  getQuillEditorLength() {
    return this.advertForm.get("jobDefinition").value.length;
  }
  getProvinces() {
    return this.locationService.getProvinces();
  }
  getDistricts() {
    if (this.advertForm.get("provinceID").value > -1) {
      return this.locationService.getProvinces()[
        this.advertForm.get("provinceID").value
      ].ilceleri;
    }
  }
  cachedFile(event: { url: string; type: string }) {
    this.sanitizer.bypassSecurityTrustUrl(event.url);
    this.photoUrl = event.url;
  }

  onProvinceChange() {
    this.advertForm.patchValue({ district: "forb" });
  }
  findInvalidControls() {
    const invalid = [];
    const controls = this.advertForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  private getAdvertDetails() {
    this.dataService
      .get<AdvertInfo>(
        LOCALHOST_ADVERTS + `/${this.advertID}/advertInfo`
      )
      .subscribe((response) => {
        this.advert = JSON.parse(JSON.stringify(response.body));
        this.patchForm();
      });

    this.dataService
      .get<Blob>(
        LOCALHOST_ADVERTS + `/${this.advertID}/photo`
      )
      .subscribe((response) => {
        this.photoUrl =
          "data:image/jpeg;base64," +
          JSON.parse(JSON.stringify(response.body));
        this.sanitizer.bypassSecurityTrustUrl(this.photoUrl);
      });
  }
  private initForm() {
    this.advertForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      summary: new FormControl(null, Validators.required),
      position: new FormControl(null, Validators.required),
      capacity: new FormControl(null, [Validators.required, Validators.min(0)]),
      companyName: new FormControl(null, Validators.required),
      department: new FormControl(null, Validators.required),
      startDate: new FormControl(formatDate(this.today, "yyyy-MM-dd", "en"), [
        Validators.required,
      ]),
      endDate: new FormControl(formatDate(this.today, "yyyy-MM-dd", "en"), [
        Validators.required,
      ]),
      provinceID: new FormControl(this.forbiddenValue, [
        Validators.required,
        (control: AbstractControl) => {
          return this.forbiddenValue.indexOf(control.value) === -1
            ? null
            : { forbiddenValue: true };
        },
      ]),
      province: new FormControl(null),
      district: new FormControl(this.forbiddenValue, [
        Validators.required,
        (control: AbstractControl) => {
          return this.forbiddenValue.indexOf(control.value) === -1
            ? null
            : { forbiddenValue: true };
        },
      ]),
      jobDefinition: new FormControl(null, [
        Validators.required,
        Validators.minLength(20),
      ]),
    });

    if (!this.isAdmin) {
      this.advertForm.disable();
    }
  }
  private applyForAdvert() {
    this.dataService
      .create<any>(
        this.currentUserID,
        LOCALHOST_ADVERTS + `/${this.advertID}/applications`
      )
      .subscribe(
        (response) => {},
        (error) => {
          this.errorPopupService.alert(error.error.message);
        }
      );
  }

  private createAdvert() {
    const params = new HttpParams().append(
      USER_ID,
      this.authService.userId
    );
    this.dataService
      .create<AdvertInfo>(
        this.advert,
        LOCALHOST_ADVERTS,
        params
      )
      .subscribe(
        (response) => {
          this.sendPhotoHandler.next(response.body.id);
        },
        (error) => {
          this.errorPopupService.alert(error.error.message);
        }
      );
  }

  private editAdvert() {
    this.dataService
      .update<AdvertInfo>(
        this.advert,
        LOCALHOST_ADVERTS + `/${this.advertID}/advertInfo`
      )
      .subscribe(
        (response) => {
          this.sendPhotoHandler.next(this.advertID);
        },
        (error) => {
          this.errorPopupService.alert(error.error.message);
        }
      );
  }

  private formToAdvert() {
    if (!this.advert) {
      this.advert = <AdvertInfo>{};
    }
    this.advert.name = this.advertForm.get("name").value;
    this.advert.summary = this.advertForm.get("summary").value;
    this.advert.startDate = this.advertForm.get("startDate").value;
    this.advert.endDate = this.advertForm.get("endDate").value;
    this.advert.provinceID = this.advertForm.get("provinceID").value;
    this.advert.province = this.advertForm.get("province").value;
    this.advert.district = this.advertForm.get("district").value;
    this.advert.position = this.advertForm.get("position").value;
    this.advert.jobDefinition = this.advertForm.get("jobDefinition").value;
    this.advert.capacity = this.advertForm.get("capacity").value;
    this.advert.companyName = this.advertForm.get("companyName").value;
    this.advert.department = this.advertForm.get("department").value;
  }

  private setUploadCredentials() {
    this.photoUploadCredentials = {
      type: "advert",
      ID: this.advertID,
      requiredFileType: "image/png, ,image/jpeg",
      caption: "photo",
    };
  }

  private correctProvinceID() {
    this.advertForm.patchValue({
      province:
      this.locationService.getProvinces()[
        this.advertForm.get("provinceID").value
        ].il,
    });
  }
}
