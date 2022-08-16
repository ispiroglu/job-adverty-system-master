import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserComponent } from "../../pages/user/user.component";
import { AdvertsComponent } from "../../pages/adverts/adverts.component";
import { NgbModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
import { MatDialogModule } from "@angular/material/dialog";
import { UserModalComponent } from "app/pages/adverts/advert/advert-modal/user-modal.component";
import { LoadingSpinnerComponent } from "app/shared/loading-spinner/loading-spinner.component";
import { ApplicationsComponent } from "app/pages/applications/applications.component";
import { FileUploadComponent } from "../../shared/file-upload/file-upload/file-upload.component";
import { AdvertComponent } from "../../pages/adverts/advert/advert.component";
import { TableComponent } from "../../pages/adverts/advert/table/table.component";
import { QuillEditorComponent } from "ngx-quill";
import { InfiniteScrollModule } from "ngx-infinite-scroll";

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
    InfiniteScrollModule,
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TableComponent,
    AdvertsComponent,
    UserModalComponent,
    LoadingSpinnerComponent,
    ApplicationsComponent,
    FileUploadComponent,
    AdvertComponent,
    TableComponent,
  ],
})
export class AdminLayoutModule {}
