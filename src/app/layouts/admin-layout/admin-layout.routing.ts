import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { AdvertsComponent } from "../../pages/adverts/adverts.component";
import { AdvertComponent } from "app/pages/adverts/advert/advert.component";
import { ApplicationsComponent } from "app/pages/applications/applications.component";
import { DashboardGuard } from "app/shared/dashboard.guard";
import { UserDetailsGuard } from "app/shared/applications-userDetails.guard";
import { AdvertsGuard } from "app/shared/adverts.guard";
import { AdvertDetailsGuard } from "app/shared/advert-detail.guard";
export const AdminLayoutRoutes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [DashboardGuard],
  },
  { path: "user", component: UserComponent, canActivate: [UserDetailsGuard] },
  {
    path: "adverts",
    canActivate: [AdvertsGuard],
    children: [
      { path: "", component: AdvertsComponent },
      {
        path: "new",
        component: AdvertComponent,
        canActivate: [DashboardGuard],
      },
      {
        path: ":id",
        component: AdvertComponent,
        canActivate: [UserDetailsGuard],
      },
      {
        path: ":id/edit",
        component: AdvertComponent,
        canActivate: [AdvertDetailsGuard],
      },
    ],
  },
  {
    path: "myApplications",
    component: ApplicationsComponent,
    canActivate: [UserDetailsGuard],
  },
];
