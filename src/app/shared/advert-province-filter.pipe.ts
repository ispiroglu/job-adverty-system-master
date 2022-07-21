import { Pipe, PipeTransform } from "@angular/core";
import { Advert } from "app/pages/adverts/advert.model";

@Pipe({ name: "AdvertProvinceFilter" })
export class AdvertProvinceFilter implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    return items.filter((it: Advert) => {
      return it.province.includes(searchText);
    });
  }
}
