import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class DashboardGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    const loggedIn = this.authService.loggedIn;
    const isEmployer = this.authService.isEmployer;

    return loggedIn && isEmployer
      ? true
      : this.router.createUrlTree(["/login"]);
  }
}
