import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { LocationService } from "../../shared/locationJson/location-json.service";
import {
  AdvertStatus,
  ApplicationDetail,
} from "app/shared/application/application.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private users: User[] = [];
  currentUserID = 1;
  currentUser: User;

  constructor(private locationService: LocationService) {
    for (let i = 0; i < 10; i++) {
      this.users.push(
        new User(
          i,
          "Evren",
          "Ispiroglu",
          "Male",
          "evrenn.ispiroglu@gmail.com",
          "5427261042",
          "İstanbul",
          34,
          "Şişli",
          5,
          "This is about user section",
          [
            new ApplicationDetail(0, AdvertStatus.Pending),
            new ApplicationDetail(1, AdvertStatus.Pending),
            new ApplicationDetail(6, AdvertStatus.Pending),
            new ApplicationDetail(2, AdvertStatus.Pending),
          ]
        )
      );
    }
    this.users[this.currentUserID];
  }
  getCurrentUser(): User {
    return this.currentUser;
  }
  getUser(id: number) {
    return this.users[id];
  }
  getUsers() {
    return this.users.slice();
  }
  getCurrentUserID() {
    return this.currentUserID;
  }
  getUserApplications(userID: number): ApplicationDetail[] {
    return this.users[userID].applicationsDetails;
  }
  updateUser(newUser: User, userID: number) {
    newUser.id = userID;
    console.log(newUser.provinceID);
    console.log(this.locationService.getProvinces()[0]);
    newUser.province =
      this.locationService.getProvinces()[newUser.provinceID].il;
    this.users[userID] = newUser;
  }
  acceptUserApplication(userID: number, advertID: number) {
    const user = this.users[userID];
    const application = user.applicationsDetails.find(
      (application) => application.AdvertId === advertID
    );
    application.status = AdvertStatus.Accept;
  }
  rejectUserApplication(userID: number, advertID: number) {
    const user = this.users[userID];
    const application = user.applicationsDetails.find(
      (application) => application.AdvertId === advertID
    );
    application.status = AdvertStatus.Reject;
  }
  addAdvertToUserApplications(userID: number, advertID: number) {
    this.users[userID].applicationsDetails.push(
      new ApplicationDetail(advertID, AdvertStatus.Pending)
    );
  }
}
