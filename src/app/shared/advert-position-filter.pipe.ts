import { Pipe, PipeTransform } from "@angular/core";
import { Advert } from "app/pages/adverts/advert.model";

@Pipe({ name: "AdvertPositionFilter" })
export class AdvertPositionFilter implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase();
    console.log(searchText);

    return items.filter((it: Advert) => {
      return it.position.toLocaleLowerCase().includes(searchText);
    });
  }
}
