import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import Chart from "chart.js";
import { Advert } from "../adverts/advert.model";
import { AdvertService } from "../adverts/advert/advert.service";
import { UserService } from "../user/user.service";

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
  soonEndingAdverts: Advert[];
  soonStartingAdverts: Advert[];

  constructor(
    public datepipe: DatePipe,
    private userService: UserService,
    private advertService: AdvertService
  ) {}

  ngOnInit() {
    const date = new Date();
    this.todaysDate = this.datepipe.transform(date, "dd/MM/yyyy").toString();
    this.chartColor = "#FFFFFF";

    this.totalUserCount = this.userService.getUsers().length;
    for (const advert of this.advertService.getAdverts()) {
      if (advert.isOpen) {
        this.totalOpenAdvertCount++;
      } else {
        this.totalClosedAdvertCount++;
      }
    }
    this.totalAdvertCount =
      this.totalClosedAdvertCount + this.totalOpenAdvertCount;

    console.log(this.totalAdvertCount);

    this.soonEndingAdverts = this.advertService
      .getAdverts()
      .filter((advert: Advert) => {
        if (
          advert.isOpen &&
          new Date(advert.endDate).valueOf() - date.valueOf() < 5
        ) {
          return advert;
        }
      });

    this.soonStartingAdverts = this.advertService
      .getAdverts()
      .filter((advert: Advert) => {
        if (
          advert.isOpen &&
          date.valueOf() - new Date(advert.endDate).valueOf() < 5
        ) {
          return advert;
        }
      });
  }
}
