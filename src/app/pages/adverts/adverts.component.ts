import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/shared/auth.service";
import { LocationService } from "app/shared/locationJson/location-json.service";
import { AdvertCardModel } from "./shared/models/advert-card.model";
import { DataService } from "app/shared/http/data.service";
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
    this.dataService
      .get<AdvertCardModel[]>("http://localhost:8080/api/v1/adverts")
      .subscribe((response) => {
        this.theAdverts = JSON.parse(JSON.stringify(response.body));
        for (const advertCard of this.theAdverts) {
          advertCard.imageURL = 'data:image/jpeg;base64,' + advertCard.image;
          this.sanitizer.bypassSecurityTrustUrl(advertCard.imageURL);
        }
      });

    this.authService.adminHasChanged.subscribe(
      (isLoggedIn: boolean) => { this.isAdmin = isLoggedIn }
    )
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
    console.log("1")
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
