import { Injectable } from "@angular/core";
import { User } from "./user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private users: User[] = [];

  constructor() {
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
}
