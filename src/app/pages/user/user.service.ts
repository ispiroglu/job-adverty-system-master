import { Injectable } from "@angular/core";
import { User } from "./shared/model/user.model";
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
            new ApplicationDetail(0, AdvertStatus.PENDING),
            new ApplicationDetail(1, AdvertStatus.PENDING),
            new ApplicationDetail(6, AdvertStatus.PENDING),
            new ApplicationDetail(2, AdvertStatus.PENDING),
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
    newUser.applicationsDetails = this.users[userID].applicationsDetails;
    newUser.province =
      this.locationService.getProvinces()[newUser.provinceID].il;
    this.users[userID] = newUser;
  }
  acceptUserApplication(userID: number, advertID: number) {
    const user = this.users[userID];
    const application = user.applicationsDetails.find(
      (application) => application.AdvertId === advertID
    );
    application.status = AdvertStatus.ACCEPT;
  }
  rejectUserApplication(userID: number, advertID: number) {
    const user = this.users[userID];
    const application = user.applicationsDetails.find(
      (application) => application.AdvertId === advertID
    );
    application.status = AdvertStatus.REJECT;
  }
  addAdvertToUserApplications(userID: number, advertID: number) {
    this.users[userID].applicationsDetails.push(
      new ApplicationDetail(advertID, AdvertStatus.PENDING)
    );
  }
}
