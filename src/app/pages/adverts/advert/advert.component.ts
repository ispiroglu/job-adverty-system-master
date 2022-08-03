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
import {AddApplicantRequestModel} from '../shared/models/add-applicant-request.model';
import {DomSanitizer} from '@angular/platform-browser';

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

  photoUrl = "";
  advertForm: FormGroup;
  loginSubs: Subscription;
  createMode = false;
  isAdmin = false; // need real auth
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
    private dataService: DataService,
    private sanitizer: DomSanitizer
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
    this.dataService.get<Blob>(`http://localhost:8080/api/v1/adverts/${this.advertID}/photo`)
      .subscribe((response) => {
        this.photoUrl = 'data:image/jpeg;base64,' + JSON.parse(JSON.stringify(response.body));
        this.sanitizer.bypassSecurityTrustUrl(this.photoUrl);
      })
    this.initForm();

    if (!this.createMode) {
      this.dataService
        .get<AdminAdvertInfo>(
          `http://localhost:8080/api/v1/adverts/${this.advertID}/adminView`
        )
        .subscribe((response) => {
          this.advert = JSON.parse(JSON.stringify(response.body));
          this.patchForm();
        });
    }
  }

  isFormValid() {
    // return this.advertForm.valid;
    return true;
  }
  onSubmit() {
    const confirmText = !this.isAdmin
      ? "Do you really want to apply to this job? "
      : this.createMode
      ? "Do you really want to create this job? "
      : "Do you really want to edit this job";
    this.confirmationService.confirm(confirmText, () => {
      this.advertForm.patchValue({
        province:
        this.locationService.getProvinces()[
          this.advertForm.get("provinceID").value
          ].il,
      });
      if (!this.isAdmin) { // APPLY
        this.dataService.create<number>(this.currentUserID, `http://localhost:8080/api/v1/adverts/${this.advertID}/applications`)
          .subscribe((response) => {
            console.log(response)})
      } else {
        this.formToAdvert();
        if (this.createMode) {
          this.dataService.create<AdminAdvertInfo>(this.advert, `http://localhost:8080/api/v1/adverts`).subscribe(
            (response) => {
              console.log(response)}
          )
        } else {
          this.dataService.update<AdminAdvertInfo>(this.advert, `http://localhost:8080/api/v1/adverts/${this.advertID}/adminView`)
            .subscribe(
              (response) => {
                console.log(response)}
            );
        }
      }
      this.router.navigate(["/adverts"]);
    });
  }

  private formToAdvert() {
    if (!this.advert) {
      this.advert = <AdminAdvertInfo>{}
    }
    this.advert.name = this.advertForm.get('name').value;
    this.advert.summary = this.advertForm.get('summary').value;
    this.advert.startDate = this.advertForm.get('startDate').value;
    this.advert.endDate = this.advertForm.get('endDate').value;
    this.advert.provinceID = this.advertForm.get('provinceID').value;
    this.advert.province = this.advertForm.get('province').value;
    this.advert.district = this.advertForm.get('district').value;
    this.advert.position = this.advertForm.get('position').value;
    this.advert.jobDefinition = this.advertForm.get('jobDefinition').value;
    this.advert.capacity = this.advertForm.get('capacity').value;
    this.advert.companyName = this.advertForm.get('companyName').value;
    this.advert.department = this.advertForm.get('department').value;
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
    const jobName = "";
    const jobSummary = "";
    const jobStartDate = new Date().toDateString();
    const jobEndDate = new Date().toDateString();
    const jobProvinceID = 0;
    const jobProvince = "";
    const jobDistrict = "";
    const jobPosition = "";
    const jobDesc = "";
    const jobCapacity = 0;
    const jobCompanyName = "";
    const jobDepartment = "";

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
      district: new FormControl(jobDistrict, Validators.required),
      jobDefinition: new FormControl(jobDesc, [
        Validators.required,
        Validators.minLength(20),
      ]),
    });

    if (!this.isAdmin) {
      this.advertForm.disable();
      this.currentUserID = 2;
      // this.currentUserID = this.userService.getCurrentUserID();
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
