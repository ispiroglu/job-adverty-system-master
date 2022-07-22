import { Injectable } from "@angular/core";
import { Advert } from "app/pages/adverts/advert.model";
import { UserService } from "app/pages/user/user.service";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AdvertService {
  adverts: Advert[] = [
    {
      id: 0,
      name: "Advert Zero",
      summary: "This is the summary of advert zero",
      startDate: "06/06/2022",
      endDate: "06/06/2022",
      position: "INTERN",
      companyName: "LC Waikiki",
      department: "IT",
      capacity: 10,
      applications: 6,
      district: "Remote",
      province: "Remote",
      provinceID: 0,
      jobDefinition:
        "This is a very long text that describes the definition of advert zero",
      isOpen: true,
      photoUrl:
        "https://i.pinimg.com/originals/91/38/bf/9138bf7b781c8954841e6ea7757e51cb.png",
      applicants: this.userService.getUsers(),
    },
    {
      id: 1,
      name: "Advert One",
      summary: "This is the summary of advert One",
      startDate: "06/06/2022",
      endDate: "06/06/2022",
      position: "INTERN",
      companyName: "LC Waikiki",
      department: "IT",
      capacity: 10,
      applications: 7,
      district: "Remote",
      province: "Remote",
      provinceID: 0,
      jobDefinition:
        "This is a very long text that describes the definition of advert one",
      isOpen: true,
      photoUrl:
        "https://i.pinimg.com/originals/91/38/bf/9138bf7b781c8954841e6ea7757e51cb.png",
      applicants: [],
    },
    {
      id: 2,
      name: "Advert Two",
      summary: "This is the summary of advert Two",
      startDate: "06/06/2022",
      endDate: "06/06/2022",
      position: "INTERN",
      companyName: "LC Waikiki",
      department: "IT",
      capacity: 10,
      applications: 3,
      district: "Remote",
      province: "Remote",
      provinceID: 0,
      jobDefinition:
        "This is a very long text that describes the definition of advert Two",
      isOpen: true,
      photoUrl:
        "https://i.pinimg.com/originals/91/38/bf/9138bf7b781c8954841e6ea7757e51cb.png",
      applicants: this.userService.getUsers(),
    },
  ];

  advertsChanged = new Subject<Advert[]>();

  constructor(private userService: UserService) {
    for (let i = 3; i < 20; i++) {
      this.adverts.push({
        id: i,
        name: "Advert Dummy",
        summary: "This is the summary of advert Dummy",
        startDate: "06/06/2022",
        endDate: "07/07/2022",
        position: "INTERN",
        capacity: 10,
        applications: 3,
        companyName: "LC Waikiki",
        department: "IT",
        district: "Remote",
        province: "Remote",
        provinceID: 0,
        jobDefinition:
          "This is a very long text that describes the definition of advert Dummy",
        isOpen: true,
        photoUrl:
          "https://i.pinimg.com/originals/91/38/bf/9138bf7b781c8954841e6ea7757e51cb.png",
        applicants: [],
      });
    }
  }
  getAdverts() {
    return this.adverts.slice();
  }
  getAdvert(id: number): Advert {
    return this.adverts[id];
  }

  addAdvert(advert: Advert) {
    advert.id = this.adverts.length;
    advert.isOpen = true;
    advert.applicants = [];
    this.adverts.push(advert);
    this.advertsChanged.next(this.adverts);
  }
  updateAdvert(id: number, newAdvert: Advert) {
    // Applicant list should come together.
    newAdvert.id = id;
    newAdvert.isOpen = true;
    newAdvert.applicants = this.adverts[id].applicants;
    this.adverts[id] = newAdvert;
    this.advertsChanged.next(this.adverts);
  }
  deleteAdvert(id: number) {
    // Should close advert. Not delete it.
    this.adverts[id].isOpen = false;
  }
  getApplicants(id: number) {
    return this.adverts[id].applicants;
  }
}
