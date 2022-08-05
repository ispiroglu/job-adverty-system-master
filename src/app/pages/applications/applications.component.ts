import { Component, OnInit } from "@angular/core";
import {DataService} from '../../shared/http/data.service';
import {ApplicationTableInfoModel} from './model/application-table-info.model';



@Component({
  selector: "app-applications",
  templateUrl: "./applications.component.html",
})
export class ApplicationsComponent implements OnInit {
  applications: ApplicationTableInfoModel[];
  userID: number;

  constructor(
    private dataService: DataService,
  ) {
    this.userID = 2; // Should get this from auth
  }
  ngOnInit() {
    this.dataService.get<ApplicationTableInfoModel[]>(`http://localhost:8080/api/v1/users/${this.userID}/applications`)
      .subscribe((response) => {
        console.log(response)
        this.applications = response.body
        console.log(this.applications);
      })
  }
}
