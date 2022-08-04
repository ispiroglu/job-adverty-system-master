import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  private ADVERT_API = "http://localhost:8080/api/v1/adverts/";
  private USER_API = "http://localhost:8080/api/v1/users/";
  constructor(private httpClient: HttpClient) {}

  uploadAdvertPhoto(advertID: number, formData: FormData) {
    const URL = this.ADVERT_API + advertID + "/photo";
    return this.httpClient.patch(URL, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  uploadUserProfile(userID: number, formData: FormData) {
    const URL = this.USER_API + userID + "/photo";
    return this.httpClient.patch(URL, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  uploadUserCv(userID: number, formData: FormData) {
    const URL = this.USER_API + userID + "/cv";
    return this.httpClient.patch(URL, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}
