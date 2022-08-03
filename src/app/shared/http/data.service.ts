import {HttpClient, HttpHeaders} from '@angular/common/http';
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
    const headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return this.httpPost<T>(url, resource, headers);
  }

  update<T>(resource, url: string) {
    const headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    return this.httpPatch(url, resource, headers);
  }

  delete<T>(url: string) {
    return this.httpDelete(url);
  }
  get<T>(url: string) {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8')
    return this.httpGet<T>(url, headers);
  }
}
