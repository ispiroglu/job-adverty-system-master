import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public clientID = "advert-service";
  public redirectUri = "http://localhost:4200/login";
  constructor(private httpClient: HttpClient) {}

  retrieveToken(code) {
    let params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", this.clientID);
    params.append("client_secret", "6X1giwZ5SVL7WbZAEIAWya75ELBhvFYx");
    params.append("redirect_uri", this.redirectUri);
    params.append("code", code);

    let headers = new HttpHeaders({
      "Content-type": "application/x-www-form-urlencoded; charset=utf-8",
    });

    this.httpClient
      .post(
        "http://localhost:8090/realms/dev/protocol/openid-connect/token",
        params.toString(),
        { headers: headers }
      )
      .subscribe(
        (data) => this.saveToken(data),
        (err) => {
          console.log(err);

          alert("Invalid Credentials");
        }
      );
  }

  saveToken(token) {
    var expireDate = new Date().getTime() + 1000 * token.expires_in;
    localStorage.setItem("access_token", token.access_token);
    // localStorage.setItem("access_token", token.access_token, expireDate);
    console.log("Obtained Access token");
    window.location.href = "http://localhost:4200/";
  }

  getResource(resourceUrl): Observable<any> {
    console.log(localStorage.getItem("access_token"));

    var headers = new HttpHeaders({
      "Content-type": "application/x-www-form-urlencoded; charset=utf-8",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    });

    return this.httpClient.get(resourceUrl, { headers: headers });
  }

  checkCredentials() {
    return !!localStorage.getItem("access_token");
  }

  logout() {
    localStorage.removeItem("access_token");
    window.location.reload();
  }
}
