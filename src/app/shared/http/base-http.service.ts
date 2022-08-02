import { HttpClient, HttpHeaders } from "@angular/common/http";

export class BaseHttpService {
  constructor(protected httpClient: HttpClient) {}

  httpGet<T>(requestUrl: string = "", headers?: HttpHeaders) {
    return this.httpClient.get<T>(requestUrl, {
      headers,
      observe: "response",
    });
  }

  httpPost<T>(requestUrl: string = "", data: any, headers?: HttpHeaders) {
    /*
        file operation?
    */
    return this.httpClient.post(requestUrl, data, {
      headers,
      observe: "response",
    });
  }

  httpPatch<T>(requestUrl: string = "", data: any, headers?: HttpHeaders) {
    return this.httpClient.patch<T>(requestUrl, data, {
      headers,
      observe: "response",
    });
  }

  httpDelete<T>(requestUrl: string = "", headers?: HttpHeaders) {
    return this.httpClient.get<T>(requestUrl, {
      headers,
      observe: "response",
    });
  }

  /*
    GET HTTP HEADER? 
  */
}
