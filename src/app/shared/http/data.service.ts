import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseHttpService } from "./base-http.service";

@Injectable({
  providedIn: "root",
})
export class DataService extends BaseHttpService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  create<T>(resource, url: string) {
    return this.httpPost<T>(url, resource);
  }

  update<T>(resource, url: string) {
    return this.httpPatch(url, resource);
  }

  delete<T>(url: string) {
    return this.httpDelete(url);
  }
  get<T>(url: string) {
    return this.httpGet<T>(url);
  }
}
