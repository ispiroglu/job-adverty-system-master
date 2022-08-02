import { formatDate } from "@angular/common";
import {
  AfterViewInit,
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
import { AdvertInfoModel } from "app/pages/dashboard/models/advert-info.model";
import { UserService } from "app/pages/user/user.service";
import { AuthService } from "app/shared/auth.service";
import { ConfirmationPopupService } from "app/shared/confirmation-popup/confirmation-popup.service";
import { DataService } from "app/shared/http/data.service";
import { LocationService } from "app/shared/locationJson/location-json.service";
import { Subscription } from "rxjs";
import { AdminAdvertInfo } from "../shared/models/admin-advert-info.model";

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
export class AdvertComponent implements OnInit, OnDestroy, AfterViewInit {
  advert: AdminAdvertInfo;

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

  uploadedImage: File;
  dbImage: any;
  postResponse: any;
  successResponse: string;
  image: any;

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
    private confirmationService: ConfirmationPopupService,
    private dataService: DataService
  ) {}
  ngAfterViewInit(): void {}

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
    });

    this.initForm();

    this.dataService
      .get<AdminAdvertInfo>(
        `http://localhost:8080/api/v1/adverts/${this.advertID}/adminView`
      )
      .subscribe((response) => {
        console.log(31);

        this.advert = JSON.parse(JSON.stringify(response.body));
        console.log(this.advert);

        this.pathForm();
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
      jobDefinition: new FormControl(jobDesc, [
        Validators.required,
        Validators.minLength(20),
      ]),
      photoUrl: new FormControl(jobImgPath),
    });

    if (!this.isAdmin) {
      this.advertForm.disable();
      this.currentUserID = this.userService.getCurrentUserID();
    }
  }

  pathForm() {
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

  onImageUpload(event: any) {
    this.uploadedImage = event.target.files[0];
  }

  onSelectFile(event: any) {
    const imgFormData = new FormData();
    imgFormData.append("image", this.uploadedImage, this.uploadedImage.name);
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
