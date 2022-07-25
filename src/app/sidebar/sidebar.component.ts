import { Component, OnInit } from "@angular/core";

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "nc-bank", class: "" },
  {
    path: "/adverts",
    title: "Adverts",
    icon: "nc-bell-55",
    class: "",
  },

  { path: "/user", title: "User", icon: "nc-single-02", class: "" },
  { path: "/auth", title: "Authenticate", icon: "nc-key-25", class: "" },
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
  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
}
