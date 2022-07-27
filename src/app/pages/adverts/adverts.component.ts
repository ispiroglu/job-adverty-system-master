import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdvertService } from "app/pages/adverts/advert/advert.service";
import { AdvertProvinceFilter } from "app/shared/advert-province-filter.pipe";
import { AdvertSearchFilter } from "app/shared/advert-search-filter.pipe";
import { AuthService } from "app/shared/auth.service";
import { Advert } from "./advert.model";
import { LocationService } from "app/shared/locationJson/location-json.service";

@Component({
  selector: "notifications-cmp",
  moduleId: module.id,
  templateUrl: "adverts.component.html",
})
export class AdvertsComponent implements OnInit {
  @ViewChild("province", { static: false }) provinceFilter: ElementRef;

  selectedProvince: string;
  searchText;
  selectedDepartment: string;
  selectedPosition: string;
  isAdmin = true;
  adverts: Advert[];
  activeAdverts: Advert[];
  jsonDataPath: string = "../../../assets/json/province.json";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private advertService: AdvertService,
    private authService: AuthService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.loggedIn;
    this.advertService.advertsChanged.subscribe((newAdverts: Advert[]) => {
      this.adverts = newAdverts;
    });
    this.adverts = this.advertService.getAdverts();
    this.authService.adminHasChanged.subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
    });
    this.activeAdverts = this.adverts.slice();
  }
  getActiveAdverts() {
    return this.activeAdverts.filter((advert: Advert) => {
      return advert.isOpen;
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
    this.authService.toggleLoggedIn();
    console.log(this.getProvinces());
  }
  onClickFilter() {}
  getProvinces() {
    return this.locationService.getProvinces();
  }
}
