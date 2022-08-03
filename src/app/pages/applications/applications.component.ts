import { Component, OnInit } from "@angular/core";
import { AdvertService } from "../adverts/advert/advert.service";
import { UserService } from "../user/user.service";
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
    private advertService: AdvertService,
    private userService: UserService
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
    // for (const application of this.userService.getUserApplications(
    //   this.userID
    // )) {
    //   console.log(application);
    //
    //   const advert = this.advertService.getAdvert(application.AdvertId);
    //   this.applications.push({
    //     name: advert.name,
    //     summary: advert.summary,
    //     position: advert.position,
    //     location: `${advert.district} / ${advert.province}`,
    //     status: `${application.status}`,
    //   });
    // }
  }
}
