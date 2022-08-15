import { Component, OnInit } from "@angular/core";
import { AuthService } from "app/shared/auth.service";
import { DataService } from "../../shared/http/data.service";
import { ApplicationTableInfoModel } from "./model/application-table-info.model";

@Component({
  selector: "app-applications",
  templateUrl: "./applications.component.html",
})
export class ApplicationsComponent implements OnInit {
  applications: ApplicationTableInfoModel[];
  userID: number;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.userID = this.authService.userId;
    console.log();

    console.log(this.userID);

    this.dataService
      .get<ApplicationTableInfoModel[]>(
        `http://localhost:8080/api/v1/users/${this.userID}/applications`
      )
      .subscribe(
        (response) => {
          console.log("repos");

          console.log(response);

          this.applications = response.body;
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
