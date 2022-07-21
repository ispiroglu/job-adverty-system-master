import { Pipe, PipeTransform } from "@angular/core";
import { Advert } from "app/pages/adverts/advert.model";

@Pipe({ name: "AdvertSearchFilter" })
export class AdvertSearchFilter implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    return items.filter((it: Advert) => {
      return (
        it.name.toLocaleLowerCase().includes(searchText) ||
        it.summary.toLocaleLowerCase().includes(searchText)
      );
    });
  }
}
