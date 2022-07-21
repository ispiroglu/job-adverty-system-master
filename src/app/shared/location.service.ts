import { Injectable } from "@angular/core";
import ProvinceDistrictData from "../../assets/json/province.json";

interface Province {
  il: string;
  plaka: number;
  ilceler: string[];
}
@Injectable({
  providedIn: "root",
})
export class LocationService {
  provinces: Province[];
  constructor() {
    let provincesObj = JSON.parse(JSON.stringify(ProvinceDistrictData));
    for (const iterator of provincesObj) {
      this.provinces.push(iterator);
    }

    console.log("PROVINCES");
    console.log(this.provinces);
  }
}
