import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

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
  constructor(private httpClient: HttpClient) {}

  signUp(email: string, password: string) {
    return this.httpClient.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCi4jByWaXrFV3xi3ujMWDbMPmum166GHM",
      { email: email, password: password, returnSecureToken: true }
    );
  }
}
