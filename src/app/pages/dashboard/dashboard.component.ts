import { DatePipe } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "app/shared/auth/auth.service";
import { DataService } from "app/shared/http/data.service";
import { DashboardModel } from "./models/dashboard.model";
import {USER_ID} from '../../shared/config/user-constants/user-constants.constans';

@Component({
  selector: "app-dashboard",
  moduleId: module.id,
  templateUrl: "dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  today: string;
  dashboardModel: DashboardModel;

  constructor(
    public datePipe: DatePipe,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.today = this.datePipe.transform(new Date(), "dd/MM/yyyy").toString();
    this.getDashboardDetail();
  }

  private getDashboardDetail() {
    const params = new HttpParams().append(USER_ID, this.authService.userId);
    this.dataService
      .get<DashboardModel>("http://localhost:8080/api/v1/dashboard", params)
      .subscribe((response) => {
        this.dashboardModel = JSON.parse(JSON.stringify(response.body));
      });
  }
}
