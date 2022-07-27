import { formatDate } from "@angular/common";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AdvertService } from "app/pages/adverts/advert/advert.service";
import { UserService } from "app/pages/user/user.service";
import { AuthService } from "app/shared/auth.service";
import { ConfirmationPopupService } from "app/shared/confirmation-popup/confirmation-popup.service";
import { LocationService } from "app/shared/locationJson/location-json.service";
import { Subscription } from "rxjs";

interface Province {
  il: string;
  plaka: number;
  ilceler: string[];
}

@Component({
  selector: "app-advert",
  templateUrl: "./advert.component.html",
  styleUrls: ["./advert.component.scss"],
})
export class AdvertComponent implements OnInit, OnDestroy {
  @ViewChild("province", { static: false }) provinceList: ElementRef;
  @ViewChild("district", { static: false }) districtList: ElementRef;
  @ViewChildren("userQuill") userQuill: ElementRef;
  currentUserID: number;

  photoUrl: string = "";
  advertForm: FormGroup;
  loginSubs: Subscription;
  createMode: boolean = false;
  isAdmin: boolean = false; // need real auth
  advertID: number;
  selectedProvinceID: number;
  jobDefinition: string;
  maxLength = 1000;

  quillEditorStyle = {
    height: "300px",
    backgroundColor: "#ffff",
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private advertService: AdvertService,
    private authService: AuthService,
    private locationService: LocationService,
    private userService: UserService,
    private confirmationService: ConfirmationPopupService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.loggedIn;
    this.loginSubs = this.authService.adminHasChanged.subscribe(
      (isAdmin: boolean) => {
        this.isAdmin = isAdmin;
      }
    );

    this.route.params.subscribe((params: Params) => {
      this.advertID = +params["id"];
      this.createMode = params["id"] === undefined;
      this.initForm();
    });
  }
  isFormValid() {
    return this.advertForm.valid;
  }
  onSubmit() {
    const confirmText = !this.isAdmin
      ? "Do you really want to apply to this job? "
      : this.createMode
      ? "Do you really want to create this job? "
      : "Do you really want to edit this job";
    this.confirmationService.confirm(confirmText, () => {
      if (!this.isAdmin) {
        this.advertService
          .getAdvert(this.advertID)
          .applicants.push(this.userService.getUser(this.currentUserID));
        this.userService.addAdvertToUserApplications(
          this.userService.getCurrentUserID(),
          this.advertID
        );
      } else {
        this.advertForm.patchValue({
          province:
            this.locationService.getProvinces()[
              this.advertForm.get("provinceID").value
            ].il,
        });
        if (this.createMode) {
          this.advertService.addAdvert(this.advertForm.value);
        } else {
          this.advertService.updateAdvert(this.advertID, this.advertForm.value);
        }
      }
      this.router.navigate(["/adverts"]);
    });
  }

  onClickCancel() {
    this.confirmationService.confirm("Are you really going to cancel?", () => {
      this.router.navigate(["../"], { relativeTo: this.route });
    });
  }
  onClickDelete() {
    this.confirmationService.confirm(
      "Are you sure to delete this advert?",
      () => {
        this.advertService.deleteAdvert(this.advertID);
        this.router.navigate(["../"], { relativeTo: this.route });
      }
    );
  }
  onContentChanged(event) {
    if (event.editor.getLength() > this.maxLength) {
      event.editor.deleteText(this.maxLength, event.editor.getLength());
    }
  }

  private initForm() {
    let jobName = "";
    let jobSummary = "";
    let jobImgPath = "";
    let jobStartDate = new Date().toDateString();
    let jobEndDate = new Date().toDateString();
    let jobProvinceID: number;
    let jobProvince = "";
    let jobDistrcit = "";
    let jobPosition = "";
    let jobDesc = "";
    let jobCapacity = 0;
    let jobCompanyName = "";
    let jobDepartment = "";

    if (!this.createMode) {
      const advert = this.advertService.getAdvert(this.advertID);

      jobName = advert.name;
      jobSummary = advert.summary;
      jobImgPath = advert.photoUrl;
      jobCapacity = advert.capacity;
      jobStartDate = advert.startDate;
      jobEndDate = advert.endDate;
      jobCompanyName = advert.companyName;
      jobDepartment = advert.department;
      jobProvinceID = advert.provinceID;
      jobProvince = advert.province;
      jobDistrcit = advert.district;
      jobPosition = advert.position;
      jobDesc = advert.jobDefinition;
      jobImgPath = advert.photoUrl;
    }

    this.photoUrl = jobImgPath;

    this.advertForm = new FormGroup({
      name: new FormControl(jobName, Validators.required), // Validators
      summary: new FormControl(jobSummary, Validators.required),
      position: new FormControl(jobPosition, Validators.required),
      capacity: new FormControl(jobCapacity, Validators.required),
      companyName: new FormControl(jobCompanyName, Validators.required),
      department: new FormControl(jobDepartment, Validators.required),
      startDate: new FormControl(
        formatDate(jobStartDate, "yyyy-MM-dd", "en"),
        Validators.required
      ),
      endDate: new FormControl(
        formatDate(jobEndDate, "yyyy-MM-dd", "en"),
        Validators.required
      ),
      provinceID: new FormControl(jobProvinceID, Validators.required),
      province: new FormControl(jobProvince, Validators.required),
      district: new FormControl(jobDistrcit, Validators.required),
      jobDefinition: new FormControl(jobDesc, Validators.required),
      photoUrl: new FormControl(jobImgPath),
    });

    if (!this.isAdmin) {
      this.advertForm.disable();
      this.currentUserID = this.userService.getCurrentUserID();
    }
  }

  ngOnDestroy() {
    this.loginSubs.unsubscribe();
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
    if (this.advertForm.get("provinceID").value) {
      return this.locationService.getProvinces()[
        this.advertForm.get("provinceID").value
      ].ilceleri;
    }
  }
}
