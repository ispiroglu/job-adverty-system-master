import { Injectable } from "@angular/core";
import { User } from "./user.model";
import {LocationService} from '../../shared/locationJson/location-json.service';

@Injectable({
  providedIn: "root",
})
export class UserService {
  private users: User[] = [];
  currentUserID = 1;

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
          "This is about user section"
        )
      );
    }
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
  updateUser(newUser: User, userID: number) {
    newUser.id = userID;
    console.log(newUser.provinceID)
    console.log(this.locationService.getProvinces()[0])
    newUser.province = this.locationService.getProvinces()[newUser.provinceID].il;
    this.users[userID] = newUser;
  }
}
