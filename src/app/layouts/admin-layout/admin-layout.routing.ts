import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { AdvertsComponent } from "../../pages/adverts/adverts.component";
import { AdvertComponent } from "app/pages/adverts/advert/advert.component";
import { AuthComponent } from "app/auth/auth.component";
import { ApplicationsComponent } from "app/pages/applications/applications.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "user", component: UserComponent },
  {
    path: "adverts",
    children: [
      { path: "", component: AdvertsComponent },
      { path: "new", component: AdvertComponent },
      {
        path: ":id",
        component: AdvertComponent,
        children: [{ path: "edit", component: AdvertComponent }],
      },
    ],
  },
  { path: "auth", component: AuthComponent },
  { path: "myApplications", component: ApplicationsComponent },
];
