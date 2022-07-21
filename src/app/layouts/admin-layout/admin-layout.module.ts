import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { TableComponent } from "../../pages/table/table.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { AdvertsComponent } from "../../pages/adverts/adverts.component";
import { UpgradeComponent } from "../../pages/upgrade/upgrade.component";

import { NgbModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { AdvertSearchFilter } from "app/shared/advert-search-filter.pipe";
import { AdvertProvinceFilter } from "app/shared/advert-province-filter.pipe";
import { AdvertDepartmentFilter } from "app/shared/adverts-department-filter.pipe";
import { AdvertPositionFilter } from "app/shared/advert-position-filter.pipe";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { MatDialogModule } from "@angular/material/dialog";
import { UserModal } from "app/pages/adverts/advert/advert-modal/advert-modal.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
    MatDialogModule,
    NgbTooltipModule,
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TableComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    AdvertsComponent,
    AdvertSearchFilter,
    AdvertProvinceFilter,
    AdvertDepartmentFilter,
    AdvertPositionFilter,
    UserModal,
  ],
})
export class AdminLayoutModule {}
