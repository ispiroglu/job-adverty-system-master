import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  constructor(private httpClient: HttpClient) {}

  postImage(apiUrl: String, imgFormData: FormData) {
    this.httpClient
      .post(apiUrl.toString(), imgFormData, {
        observe: "response",
      })
      .subscribe((response) => {
        if (response.status === 200) {
          console.log("upload success");
        } else {
          console.log("upload failed.");
        }
      });
  }

  // viewImage(apiUrl: String, imgFormData: FormData) {
  //   this.httpClient.
  // }
}
