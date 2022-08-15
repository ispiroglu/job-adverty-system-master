import { Component, OnInit } from "@angular/core";
import { AuthService } from "app/shared/auth.service";

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const EmployerRouteInfo: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "nc-bank", class: "" },
  {
    path: "/adverts",
    title: "Adverts",
    icon: "nc-bell-55",
    class: "",
  },
];

export const EmployeeRouteInfo: RouteInfo[] = [
  {
    path: "/adverts",
    title: "Adverts",
    icon: "nc-bell-55",
    class: "",
  },

  { path: "/user", title: "User", icon: "nc-single-02", class: "" },
  {
    path: "/myApplications",
    title: "Applications",
    icon: "nc-paper",
    class: "",
  },
];

@Component({
  moduleId: module.id,
  selector: "sidebar-cmp",
  templateUrl: "sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.authService.isEmployer
      ? (this.menuItems = EmployerRouteInfo.filter((menuItem) => menuItem))
      : (this.menuItems = EmployeeRouteInfo.filter((menuItem) => menuItem));
  }
}
