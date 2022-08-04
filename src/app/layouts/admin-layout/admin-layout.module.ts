import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
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
import { AuthComponent } from "app/auth/auth.component";
import { HttpClientModule } from "@angular/common/http";
import { LoadingSpinnerComponent } from "app/shared/loading-spinner/loading-spinner.component";
import { ApplicationsComponent } from "app/pages/applications/applications.component";
import {FileUploadComponent} from '../../shared/file-upload/file-upload/file-upload.component';
import {AdvertComponent} from '../../pages/adverts/advert/advert.component';
import {TableComponent} from '../../pages/adverts/advert/table/table.component';
import {QuillEditorComponent} from 'ngx-quill';

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
    QuillEditorComponent,
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
    AuthComponent,
    LoadingSpinnerComponent,
    ApplicationsComponent,
    FileUploadComponent,
    AdvertComponent,
    TableComponent
  ],
})
export class AdminLayoutModule {}
