import { Injectable } from "@angular/core";
import ProvinceDistrictData from "../../../assets/json/province-district.json";

interface Province {
  il: string;
  plaka: number;
  ilceler: string[];
}
@Injectable({
  providedIn: "root",
})
export class LocationService {
  private provinces = [];
  constructor() {
    let provincesObj = JSON.parse(JSON.stringify(ProvinceDistrictData));

    for (const iterator of provincesObj) {
      this.provinces.push(iterator);
    }
  }
  getProvinces() {
    return this.provinces;
  }
}
