import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { DataService } from "app/shared/http/data.service";
import Chart from "chart.js";
import { Advert } from "../adverts/advert.model";
import { AdvertService } from "../adverts/advert/advert.service";
import { UserService } from "../user/user.service";
import { AdvertInfoModel } from "./models/advert-info.model";
import { DashboardModel } from "./models/dashboard.model";

@Component({
  selector: "dashboard-cmp",
  moduleId: module.id,
  templateUrl: "dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  public canvas: any;
  public ctx;
  public chartColor;
  public chartEmail;
  public chartHours;

  todaysDate: string;
  newUserCount: number;
  totalOpenAdvertCount = 0;
  totalClosedAdvertCount = 0;
  totalUserCount: number;
  totalAdvertCount: number;
  soonEndingAdverts: AdvertInfoModel;
  soonStartingAdverts: AdvertInfoModel[];

  dashboardModel: DashboardModel;

  constructor(
    public datepipe: DatePipe,
    private userService: UserService,
    private advertService: AdvertService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    const date = new Date();
    this.todaysDate = this.datepipe.transform(date, "dd/MM/yyyy").toString();
    this.chartColor = "#FFFFFF";

    this.dataService
      .get<DashboardModel>("http://localhost:8080/api/v1/dashboard")
      .subscribe((response) => {
        console.log(response.body);

        this.dashboardModel = JSON.parse(JSON.stringify(response.body));
      });

    // this.totalUserCount = this.userService.getUsers().length;
    // for (const advert of this.advertService.getAdverts()) {
    //   if (advert.isOpen) {
    //     this.totalOpenAdvertCount++;
    //   } else {
    //     this.totalClosedAdvertCount++;
    //   }
    // }
    // this.totalAdvertCount =
    //   this.totalClosedAdvertCount + this.totalOpenAdvertCount;

    // console.log(this.totalAdvertCount);

    // this.soonEndingAdverts = this.advertService
    //   .getAdverts()
    //   .filter((advert: Advert) => {
    //     if (
    //       advert.isOpen &&
    //       new Date(advert.endDate).valueOf() - date.valueOf() < 5
    //     ) {
    //       return advert;
    //     }
    //   });

    // this.soonStartingAdverts = this.advertService
    //   .getAdverts()
    //   .filter((advert: Advert) => {
    //     if (
    //       advert.isOpen &&
    //       date.valueOf() - new Date(advert.endDate).valueOf() < 5
    //     ) {
    //       return advert;
    //     }
    //   });

    console.log(this.dashboardModel);
  }
}
