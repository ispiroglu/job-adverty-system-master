import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseHttpService } from "./base-http.service";

@Injectable({
  providedIn: "root",
})
export class DataService extends BaseHttpService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  create<T>(resource, url: string, params?: HttpParams) {
    let headers = new HttpHeaders();
    headers = headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem("access_token")
    );
    return this.httpPost<T>(url, resource, headers, params);
  }

  update<T>(resource, url: string) {
    let headers = new HttpHeaders();
    headers = headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem("access_token")
    );
    return this.httpPatch(url, resource, headers);
  }

  delete<T>(url: string) {
    let headers = new HttpHeaders();
    headers = headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem("access_token")
    );
    return this.httpDelete(url, headers);
  }
  get<T>(url: string, params?: HttpParams) {
    let headers = new HttpHeaders();
    headers = headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem("access_token")
    );
    return this.httpGet<T>(url, headers, params);
  }
}
