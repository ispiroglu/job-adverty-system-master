import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/shared/auth/auth.service";
import { LocationService } from "app/shared/locationJson/location-json.service";
import { AdvertCardModel } from "./shared/models/advert-card.model";
import { DataService } from "app/shared/http/data.service";
import { FilterModel } from "./shared/models/filter.model";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpParams } from "@angular/common/http";
import {LOCALHOST_ADVERTS, LOCALHOST_ADVERTS_FILTER} from '../../shared/config/advert-constants/advert-constants.constants';
import { USER_ID } from '../../shared/config/user-constants/user-constants.constans';

@Component({
  selector: "app-adverts",
  moduleId: module.id,
  templateUrl: "adverts.component.html",
})
export class AdvertsComponent implements OnInit {
  @ViewChild("province", { static: false }) provinceFilter: ElementRef;
  // For paging, scrolling.
  throttle = 300;
  scrollDistance = 2;
  scrollUpDistance = 6;
  pageCount = 0;
  // For filtering.
  filtered = false;
  searchText = "";
  selectedDepartment = "";
  selectedPosition = "";

  isAdmin = true;
  theAdverts: AdvertCardModel[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private locationService: LocationService,
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.authService.employerControllerHandler.subscribe((isLoggedIn: boolean) => {
      this.isAdmin = isLoggedIn;
    });
    this.getAdverts();
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
  onClickFilter() {
    // Getting the filter details.
    this.filtered = true;
    const provinceID = this.provinceFilter.nativeElement.value;
    let selectedProvince: string;
    provinceID === "-1"
      ? (selectedProvince = "")
      : (selectedProvince = this.getProvinces()[provinceID].il);
    const filterModel = new FilterModel(
      this.searchText,
      this.selectedDepartment,
      this.selectedPosition,
      selectedProvince
    );
    // Sending the request.
    this.getFilteredAdverts(filterModel);
  }
  // Clear filter.
  onClickClear() {
    this.filtered = false;
    this.pageCount = 0;
    this.getAdverts()
  }
  // Paging.
  onScrollDown() {
    if (!this.filtered) {
      this.pageCount++;
      this.appendItems();
    }
  }
  // Paging.
  private appendItems() {
    let params = new HttpParams().append("page", this.pageCount);
    if (this.isAdmin) {
      params = params.append(USER_ID, this.authService.userId);
    } else {
      params = params.append(USER_ID, -1);
    }
    this.dataService
      .get<any>(LOCALHOST_ADVERTS, params)
      .subscribe((response) => {
        const newAdverts = JSON.parse(JSON.stringify(response.body.content));
        this.theAdverts.push(...newAdverts);
        for (const advertCard of this.theAdverts) {
          advertCard.imageURL = "data:image/jpeg;base64," + advertCard.image;
          this.sanitizer.bypassSecurityTrustUrl(advertCard.imageURL);
        }
      });
  }

  // For getting the dropdown values of provinces.
  getProvinces() {
    return this.locationService.getProvinces();
  }

  private getAdverts() {
    let params = new HttpParams().append("page", this.pageCount);
    if (this.isAdmin) {
      params = params.append(USER_ID, this.authService.userId);
    } else {
      params = params.append(USER_ID, -1);
    }
    this.dataService
      .get<any>(LOCALHOST_ADVERTS, params)
      .subscribe((response) => {
        this.theAdverts = JSON.parse(JSON.stringify(response.body.content));
        for (const advertCard of this.theAdverts) {
          advertCard.imageURL = "data:image/jpeg;base64," + advertCard.image;
          this.sanitizer.bypassSecurityTrustUrl(advertCard.imageURL);
        }
      });
  }
  private getFilteredAdverts(filterModel: FilterModel) {
    let params = new HttpParams();
    this.isAdmin
      ? (params = params.append(USER_ID, this.authService.userId))
      : (params = params.append(USER_ID, -1));

    this.dataService
      .update<AdvertCardModel[]>(
        filterModel,
        LOCALHOST_ADVERTS_FILTER,
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
}
