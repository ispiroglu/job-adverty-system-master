import { Component, OnInit } from "@angular/core";
import { AuthService } from "app/shared/auth/auth.service";
import { DataService } from "../../shared/http/data.service";
import { ApplicationTableInfoModel } from "./model/application-table-info.model";
import { LOCALHOST_ADVERTS } from '../../shared/config/advert-constants/advert-constants.constants';
import {ErrorPopupService} from '../../shared/error-popup/error-popup.service';

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
        LOCALHOST_ADVERTS + `/${this.userID}/applications`
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
