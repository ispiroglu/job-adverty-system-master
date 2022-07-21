import { formatDate } from "@angular/common";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { AdvertService } from "app/adverts/advert.service";
import { AuthService } from "app/shared/auth.service";
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
  advertForm: FormGroup;
  loginSubs: Subscription;
  maxLength: number = 250;
  createMode: boolean = false;
  isAdmin: boolean; // need real auth
  editMode: boolean = false;
  jobDescContent: string;
  advertID: number;
  selectedProvinceID: number;

  quillEditorStyle = {
    height: "300px",
    backgroundColor: "#ffff",
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private advertService: AdvertService,
    private authService: AuthService,
    private locationService: LocationService
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
      this.editMode = params["edit"] !== null;
      this.initForm();
    });
  }

  onSubmit() {
    if (confirm("Are you sure to confirm?")) {
      if (this.createMode) {
        this.advertService.addAdvert(this.advertForm.value);
      } else {
        this.advertService.updateAdvert(this.advertID, this.advertForm.value);
      }

      this.router.navigate(["/adverts"]);
    }
  }

  onClickCancel() {
    if (confirm("Are you really going to cancel?")) {
      this.router.navigate(["../"], { relativeTo: this.route });
    }
  }
  onClickDelete() {
    console.log(this.advertService.getAdverts());

    if (confirm("Are you sure to delete this advert?")) {
      this.advertService.deleteAdvert(this.advertID);
      this.router.navigate(["../"], { relativeTo: this.route });
    }
    console.log(this.advertService.getAdverts());
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
      jobProvince = advert.province;
      jobDistrcit = advert.district;
      jobPosition = advert.position;
      jobDesc = advert.jobDefinition;
      jobImgPath = advert.photoUrl;
    }

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
      province: new FormControl(jobProvince, Validators.required),
      district: new FormControl(jobDistrcit, Validators.required),
      jobDefinition: new FormControl(jobDesc, Validators.required),
      // PhotoURL de eklenmeli
    });

    if (!this.isAdmin) {
      this.advertForm.disable();
    }
  }

  ngOnDestroy() {
    this.loginSubs.unsubscribe();
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
