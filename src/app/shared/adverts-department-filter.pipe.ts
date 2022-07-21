import { Pipe, PipeTransform } from "@angular/core";
import { Advert } from "app/pages/adverts/advert.model";

@Pipe({ name: "AdvertDepartmentFilter" })
export class AdvertDepartmentFilter implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    return items.filter((it: Advert) => {
      return it.department.toLocaleLowerCase().includes(searchText);
    });
  }
}
