import { Component, OnInit } from "@angular/core";
import { AuthService } from "app/shared/auth/auth.service";
import { DataService } from "../../shared/http/data.service";
import { ApplicationTableInfoModel } from "./model/application-table-info.model";
import {ErrorPopupService} from '../../shared/error-popup/error-popup.service';
import {LOCALHOST_USERS} from '../../shared/config/user-constants/user-constants.constans';

@Component({
  selector: "app-applications",
  templateUrl: "./applications.component.html",
})
export class ApplicationsComponent implements OnInit {
  applications: ApplicationTableInfoModel[];
  userID: number;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private errorPopupService: ErrorPopupService
  ) {}

  ngOnInit() {
    this.userID = this.authService.userId;
    this.dataService
      .get<ApplicationTableInfoModel[]>(
        LOCALHOST_USERS + `/${this.userID}/applications`
      )
      .subscribe(
        (response) => {
          this.applications = response.body;
        },
        (error) => {
          this.errorPopupService.alert(error.error.message);
        }
      );
  }
}
