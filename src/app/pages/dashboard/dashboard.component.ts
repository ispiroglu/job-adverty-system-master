import { DatePipe } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "app/shared/auth.service";
import { DataService } from "app/shared/http/data.service";
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
  totalOpenAdvertCount = 0;
  totalClosedAdvertCount = 0;
  totalUserCount: number;
  totalAdvertCount: number;
  soonEndingAdverts: AdvertInfoModel;
  soonStartingAdverts: AdvertInfoModel[];

  dashboardModel: DashboardModel;

  constructor(
    public datepipe: DatePipe,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    let params = new HttpParams().append("userID", this.authService.userId);
    const date = new Date();
    this.todaysDate = this.datepipe.transform(date, "dd/MM/yyyy").toString();
    this.chartColor = "#FFFFFF";

    this.dataService
      .get<DashboardModel>("http://localhost:8080/api/v1/dashboard", params)
      .subscribe((response) => {
        console.log(response);
        this.dashboardModel = JSON.parse(JSON.stringify(response.body));
      });
  }
}
