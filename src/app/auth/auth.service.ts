import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

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
    return this.httpClient
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCi4jByWaXrFV3xi3ujMWDbMPmum166GHM",
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError((errorResp) => {
          let errorMessage = "An unknown error occured!";
          if (!errorResp.error || !errorResp.error.error) {
            return throwError(errorMessage);
          }
          switch (errorResp.error.error.message) {
            case "EMAIL_EXISTS":
              errorMessage = "This email exists already.";
          }

          return throwError(errorMessage);
        })
      );
  }

  login(email: string, password: string) {}
}
