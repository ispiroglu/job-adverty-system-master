import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdvertService } from "app/pages/adverts/advert/advert.service";
import { AdvertProvinceFilter } from "app/shared/advert-province-filter.pipe";
import { AdvertSearchFilter } from "app/shared/advert-search-filter.pipe";
import { AuthService } from "app/shared/auth.service";
import { Advert } from "./advert.model";
import { LocationService } from "app/shared/locationJson/location-json.service";
import { AdvertCardModel } from "./shared/models/advert-card.model";
import { DataService } from "app/shared/http/data.service";
import {AdminAdvertInfo} from './shared/models/admin-advert-info.model';
import {FilterModel} from './shared/models/filter.model';
import {DomSanitizer} from '@angular/platform-browser';

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
  adverts: Advert[];
  activeAdverts: Advert[];
  jsonDataPath = "../../../assets/json/province.json";

  theAdverts: AdvertCardModel[];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private advertService: AdvertService,
    private authService: AuthService,
    private locationService: LocationService,
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.dataService
      .get<AdvertCardModel[]>("http://localhost:8080/api/v1/adverts")
      .subscribe((response) => {
        this.theAdverts = JSON.parse(JSON.stringify(response.body));
        for (const advertCard of this.theAdverts) {
          advertCard.imageURL = 'data:image/jpeg;base64,' + advertCard.image;
          this.sanitizer.bypassSecurityTrustUrl(advertCard.imageURL);
        }
      });

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
  }
  onClickFilter() {
    const provinceID = this.provinceFilter.nativeElement.value;
    let province: string;
    provinceID === "-1" ? province = "" : province = this.getProvinces()[provinceID].il;
    const filterModel = new FilterModel(this.searchText, this.selectedDepartment, this.selectedPosition, province);

    this.dataService
      .update<AdvertCardModel[]>(filterModel, "http://localhost:8080/api/v1/adverts/filter")
      .subscribe((response) => {
        this.theAdverts = JSON.parse(JSON.stringify(response.body));
        for (const advertCard of this.theAdverts) {
          advertCard.imageURL = 'data:image/jpeg;base64,' + advertCard.image;
          this.sanitizer.bypassSecurityTrustUrl(advertCard.imageURL);
        }
      });
  }
  getProvinces() {
    return this.locationService.getProvinces();
  }
}
