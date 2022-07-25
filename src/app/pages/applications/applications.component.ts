import { Component, OnInit } from "@angular/core";
import { AdvertService } from "../adverts/advert/advert.service";
import { UserService } from "../user/user.service";

interface AdvertDetails {
  name: string;
  summary: string;
  position: string;
  location: string;
  status: string;
}

@Component({
  selector: "app-applications",
  templateUrl: "./applications.component.html",
})
export class ApplicationsComponent implements OnInit {
  applications: AdvertDetails[] = [];
  userID: number;

  constructor(
    private advertService: AdvertService,
    private userService: UserService
  ) {
    this.userID = 1; // Should get this from auth
  }
  ngOnInit() {
    for (const application of this.userService.getUserApplications(
      this.userID
    )) {
      console.log(application);

      const advert = this.advertService.getAdvert(application.AdvertId);
      this.applications.push({
        name: advert.name,
        summary: advert.summary,
        position: advert.position,
        location: `${advert.district} / ${advert.province}`,
        status: `${application.status}`,
      });
    }
  }
}
