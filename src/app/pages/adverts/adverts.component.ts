import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/shared/auth.service";
import { LocationService } from "app/shared/locationJson/location-json.service";
import { AdvertCardModel } from "./shared/models/advert-card.model";
import { DataService } from "app/shared/http/data.service";
import { FilterModel } from "./shared/models/filter.model";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpHeaders, HttpParams } from "@angular/common/http";

@Component({
  selector: "notifications-cmp",
  moduleId: module.id,
  templateUrl: "adverts.component.html",
})
export class AdvertsComponent implements OnInit {
  @ViewChild("province", { static: false }) provinceFilter: ElementRef;

  selectedProvince = "";
  searchText = "";
  selectedDepartment = "";
  selectedPosition = "";
  isAdmin = true;
  pageCount = 0;
  sum = 12;
  theAdverts: AdvertCardModel[];
  throttle = 300;
  scrollDistance = 2;
  scrollUpDistance = 6;
  filtered = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private locationService: LocationService,
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.authService.adminHasChanged.subscribe((isLoggedIn: boolean) => {
      this.isAdmin = isLoggedIn;
    });

    let params = new HttpParams().append("page", this.pageCount);
    if (this.isAdmin) {
      params = params.append("creatorID", this.authService.userId);
    } else {
      params = params.append("creatorID", -1);
    }
    this.dataService
      .get<any>("http://localhost:8080/api/v1/adverts", params)
      .subscribe((response) => {
        this.theAdverts = JSON.parse(JSON.stringify(response.body.content));
        for (const advertCard of this.theAdverts) {
          advertCard.imageURL = "data:image/jpeg;base64," + advertCard.image;
          this.sanitizer.bypassSecurityTrustUrl(advertCard.imageURL);
        }
      });
  }

  onClickApply(id: number) {
    if (this.isAdmin) {
      this.router.navigate([`${id}/edit`], { relativeTo: this.route });
    } else {
      this.router.navigate([`${id}`], { relativeTo: this.route });
    }
  }
  onClickAdd() {
    this.router.navigate(["new"], { relativeTo: this.route });
  }
  onClickToggleLog() {
    console.log("1");
  }
  onClickFilter() {
    this.filtered = true;
    const provinceID = this.provinceFilter.nativeElement.value;
    let province: string;
    provinceID === "-1"
      ? (province = "")
      : (province = this.getProvinces()[provinceID].il);
    const filterModel = new FilterModel(
      this.searchText,
      this.selectedDepartment,
      this.selectedPosition,
      province
    );
    let params = new HttpParams();
    this.isAdmin
      ? (params = params.append("userID", this.authService.userId))
      : (params = params.append("userID", -1));

    this.dataService
      .update<AdvertCardModel[]>(
        filterModel,
        "http://localhost:8080/api/v1/adverts/filter",
        params
      )
      .subscribe((response) => {
        this.theAdverts = [];
        this.theAdverts = JSON.parse(JSON.stringify(response.body));
        for (const advertCard of this.theAdverts) {
          advertCard.imageURL = "data:image/jpeg;base64," + advertCard.image;
          this.sanitizer.bypassSecurityTrustUrl(advertCard.imageURL);
        }
      });
  }
  getProvinces() {
    return this.locationService.getProvinces();
  }

  appendItems() {
    let params = new HttpParams().append("page", this.pageCount);
    if (this.isAdmin) {
      params = params.append("creatorID", this.authService.userId);
    } else {
      params = params.append("creatorID", -1);
    }
    this.dataService
      .get<any>("http://localhost:8080/api/v1/adverts", params)
      .subscribe((response) => {
        const newAdverts = JSON.parse(JSON.stringify(response.body.content));
        this.theAdverts.push(...newAdverts);
        for (const advertCard of this.theAdverts) {
          advertCard.imageURL = "data:image/jpeg;base64," + advertCard.image;
          this.sanitizer.bypassSecurityTrustUrl(advertCard.imageURL);
        }
      });
  }

  onClickClear() {
    this.filtered = false;
    this.pageCount = 0;
    let params = new HttpParams().append("page", this.pageCount);
    if (this.isAdmin) {
      params = params.append("creatorID", this.authService.userId);
    } else {
      params = params.append("creatorID", -1);
    }
    this.dataService
      .get<any>("http://localhost:8080/api/v1/adverts", params)
      .subscribe((response) => {
        this.theAdverts = JSON.parse(JSON.stringify(response.body.content));
        for (const advertCard of this.theAdverts) {
          advertCard.imageURL = "data:image/jpeg;base64," + advertCard.image;
          this.sanitizer.bypassSecurityTrustUrl(advertCard.imageURL);
        }
      });
  }

  onScrollDown() {
    if (!this.filtered) {
      this.pageCount++;
      this.appendItems();
    }
  }
  // onScrolledUp() {
  //   if (this.pageCount !== 0) {
  //     this.pageCount--;
  //     this.theAdverts = this.theAdverts.splice(0, this.theAdverts.length - 9);
  //   }
  // }
}
